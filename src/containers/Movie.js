import React from 'react'
import Choices from '../components/choices';
import InteractiveVideo from '../components/interactive-video';
import VideoControls from '../components/video-controls';
import { IconButton } from '../components/icon';
import VolumeSlider from '../components/video-controls/volume-slider';
import PlaybackSelect from '../components/video-controls/playback-select';
import { useRouteData } from 'react-static'

import './styles.css';

class Movie extends React.Component {
  rootRef = React.createRef();
  interactiveVideoRef = React.createRef();

  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.interactiveVideoRef = React.createRef();
    this.rootNode = this.props.movie.nodes[0];
    this.state = {
      volume: 0.1,
      playing: false,
      playbackRate: 1,
      fullScreen: false,
    };
  }

  componentDidMount() {
    this.rootRef.current.addEventListener('fullscreenchange', () => {
      this.setState({
        fullScreen: document.fullscreenElement !== null
      });
    });
  }

  handleVolumeChange = ({target}) => {
    this.setState({
      volume: target.value / 100,
    });
  };

  handleVolumeClick = () => {
    this.setState(({volume}) => ({
      volume: !volume ? 1 : 0,
    }));
  };

  handlePlaybackChange = ({target}) => {
    this.setState({
      playbackRate: target.value,
    })
  };

  play = () => {
    this.setState({
      playing: true,
    });
  }

  toggleFullScreen = () => {
    if (document.fullscreenElement === null) {
      this.rootRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  pause = () => {
    this.setState({
      playing: false,
    });
  }

  stepForward = () => {
    this.interactiveVideoRef.current.incrementTime(10);
  }

  stepBackward = () => {
    this.interactiveVideoRef.current.incrementTime(-10);
  }

  render () {
    const { playing, volume, playbackRate, fullScreen } = this.state;
    const rootClass = 'video-demo' + (fullScreen ? '--fs' : '');
    return (
      <div className={rootClass} ref={this.rootRef}>
        <InteractiveVideo
          ref={this.interactiveVideoRef}
          rootNode={rootNode}
          Choices={Choices}
          {...this.state} />
        <VideoControls>
          <IconButton icon={playing ? 'pause' : 'play'}
            className="video-control-btn"
            handleOnClick={playing ? this.pause : this.play}
          />
          <IconButton icon="stepBackward"
            className="video-control-btn"
            handleOnClick={this.stepBackward}
          />
          <IconButton icon="stepForward"
            className="video-control-btn"
            handleOnClick={this.stepForward}
          />
          <VolumeSlider
            min={0}
            max={100}
            volume={volume * 100}
            handleClick={this.handleVolumeClick}
            handleVolumeChange={this.handleVolumeChange}
          />
          <PlaybackSelect value={playbackRate}
            handleOnChange={this.handlePlaybackChange} />
          <IconButton icon="expand"
            className="video-control-btn"
            handleOnClick={this.toggleFullScreen}
          />
        </VideoControls>
      </div>
    );
  }
}

export default Movie;
