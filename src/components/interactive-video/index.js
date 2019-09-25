import React from 'react';
import VideoNode from './video-node';
import './styles.css';

const createVideoNodes = (videoNodes, assetRoot) => {
  const masterList = videoNodes.map(videoNode => {
    return new VideoNode({...videoNode, assetRoot, withInit: false});
  });
  masterList.forEach(videoNode => {
    videoNode.children = 
      videoNode.children.map(({index}) => masterList[index - 1])
  });
  return masterList;
};

class InteractiveVideo extends React.Component {
  videoRef = React.createRef();
  timeRanges = [];
  mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  sourceBuffer = null;
  duration = 0;
  state = {
    choices: [],
    showChoices: false,
    selected: null,
    choiceDuration: 0,
  };

  componentDidMount() {
    // set initial video properties
    const {assetRoot, volume, nodes, handleLoad} = this.props;
    this.videoRef.current.volume = volume;

    // begin loading the video nodes
    const videoNodes = createVideoNodes(nodes, assetRoot);
    this.nodes = videoNodes;
    this.head = videoNodes[0];
    this.curr = this.head;
    
    this.initializeVideo(this.head);
  }

  componentDidUpdate(prevProps, prevState) {
    const video = this.videoRef.current;

    // a can of side effects
    const {
      volume: prevVolume,
      fullScreen: prevFullScreen,
    } = prevProps;
    const {
      volume,
      playing,
    } = this.props;

    if (volume !== prevVolume) {
      video.volume = volume;
    }

    video.playbackRate = this.props.playbackRate;

    if (playing) {
      video.play();
    } else {
      video.pause();
    }
  }

  initializeVideo = (rootNode) => {
     this.mediaSource = new window.MediaSource();
     this.videoRef.current.src = URL.createObjectURL(this.mediaSource);
     window.timeRanges = this.timeRanges = [];
     this.duration = 0;
     this.nodeIndex = null;
     this.mediaSource.addEventListener('sourceopen', () => {
       this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec);
       this.sourceBuffer.mode = 'sequence';
 
       this.loadNode(rootNode)
         .then(this.props.handleLoad);
     });
  }

  loadNode = (node, nodeIndex = 0) => {
    return node.init()
      .then(() => {
        const video = this.videoRef.current;
        this.sourceBuffer.appendBuffer(node.buf);

        return new Promise(resolve => {
          this.sourceBuffer.addEventListener('updateend', () => {
            resolve();
            handleUpdateEnd.call(this, node);
          });
        });

        function handleUpdateEnd (node) {
          console.log('in here', nodeIndex);
          this.timeRanges = this.timeRanges.concat(this.getNewTimeRanges(node, nodeIndex));
          console.log('timeranges', this.timeRanges);
          this.sourceBuffer.removeEventListener('updateend', handleUpdateEnd);
          node.children.forEach(child => child.init());
          
          console.log('index: ' + node.index, ', children: ', node.children.length);
          const startChoiceTime = this.getStartChoiceTime(nodeIndex);
          const endChoiceTime = this.getEndChoiceTime(nodeIndex);
          (node.children.length <= 1
            ? Promise.resolve()
            : this.waitForVideoTime(startChoiceTime)
                .then(() => this.setStateWithPromise(
                  {
                    choices: node.children,
                    showChoices: true,
                    selected: null,
                    choiceDuration: node.endChoice - node.startChoice,
                  }
                ))
                .then(
                  () => this.waitForVideoTime(endChoiceTime)
                )
                .then(
                  () => this.setStateWithPromise({showChoices: false})
                ))
            .then(() => {
              this.duration = video.duration;
              if (node.children.length) {
                this.loadNode(node.children[(this.state.selected || 0) % node.children.length], nodeIndex + 1);
              } else {
                this.waitForVideoTime(Math.floor(video.duration - 2))
                .then(() => {
                  if(window.confirm('replay?')) {
                    this.initializeVideo(this.nodes[0]);
                  }
                });
              }
            }); 
        };        
      });
  }

  getChoiceIndex = index => {
    return this.timeRanges.find(item => item.index === index && item.freeze);
  }

  getStartChoiceTime = index => {
    const entry = this.getChoiceIndex(index);
    console.log('startTime', entry.start);
    return entry.start;
  }

  getEndChoiceTime = index => {
    const entry = this.getChoiceIndex(index);
    console.log('endTime', entry.end);
    return entry.end;
  }

  getNewTimeRanges = (node, index) => {
    const start = this.timeRanges.length
      ? this.timeRanges[this.timeRanges.length - 1].end
      : 0;
    
    if (!node.startChoice || !node.endChoice) {
      return [{
        index,
        start,
        end: start + node.duration,
      }];
    }

    return [{
      index,
      start,
      end: start + node.startChoice,
    }, {
      index,
      start: start + node.startChoice,
      end: start + node.endChoice,
      freeze: true,
    }, {
      index,
      start: start + node.endChoice,
      end: start + node.duration,
    }];
  }

  waitForVideoTime = (seconds) => {
    return new Promise(resolve => {
      const video = this.videoRef.current;
      video.addEventListener('timeupdate', function handler () {
        if (video.currentTime >= Math.ceil(seconds)) {
          video.removeEventListener('timeupdate', handler);
          resolve();
        }
      }.bind(this));
    });
  };

  setStateWithPromise = update =>
    new Promise(resolve => this.setState(update, resolve));

  getTimeIndex = (time) => {
    if (!this.timeRanges.length) {
      return 0;
    }

    for (let i = 0; i < this.timeRanges.length; i++) {
      const {start, end} = this.timeRanges[i];
      if (time >= start && time <= end) {
        return i;
      }
    }

    return 0;
  };

  incrementTime = (increment = 10) => {
    const {showChoices} = this.state;
    const {playing} = this.props;

    if (showChoices || !playing) {
      return;
    }

    const currentTime = this.videoRef.current.currentTime;
    const adjustedTime = currentTime + increment;

    const currentIndex = this.getTimeIndex(currentTime);
    const adjustedIndex= this.getTimeIndex(adjustedTime);

    if (currentIndex === adjustedIndex) {
      this.videoRef.current.currentTime = adjustedTime;
    }
  }

  render () {
    const {Choices} = this.props;
    const {choices, choiceDuration, showChoices, selected, duration} = this.state;

    return (
      <div className="video-container">
        <div className="overlay">
          <Choices
            choiceDuration={choiceDuration}
            playbackRate={
              this.videoRef.current ? this.videoRef.current.playbackRate : 1
            }
            showing={showChoices}
            choices={choices}
            selected={selected}
            handleOnClick= {
              selected === null
                ? index => this.setState({selected: index})
                : null
            }
          />
        </div>
        <video ref={this.videoRef} />
      </div>
    );
  }
}

export default InteractiveVideo;
