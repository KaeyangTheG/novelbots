import React from 'react'
import Choices from '../components/choices';
import InteractiveVideo from '../components/interactive-video';
import VideoControls from '../components/video-controls';
import { IconButton } from '../components/icon';
import VolumeSlider from '../components/video-controls/volume-slider';
import PlaybackSelect from '../components/video-controls/playback-select';
import { useRouteData } from 'react-static'
import {socketHelper, SOCKET_EVENTS} from '../util/socket';

import './styles.css';

const getMaxVote = votes => {
  if (!votes || !votes.length) {
    return 0;
  }

  const tally = {};

  for(let i = 0; i < votes.length; i++) {
    let count = tally[votes[i].index] || 0;
    tally[votes[i].index] = count + 1;
  }

  return Object.keys(tally).sort((a, b) => {
    return tally[b] - tally[a];
  })[0];
};

class Movie extends React.Component {
  rootRef = React.createRef();
  interactiveVideoRef = React.createRef();

  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.interactiveVideoRef = React.createRef();
    this.nodes = props.movie.nodes;
    this.state = {
      volume: 0.1,
      playing: false,
      playbackRate: 1,
      fullScreen: false,
      sharedViewing: !!this.props.sessionId,
      votes: [],
    };
    window.socket = socketHelper.get();
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

  handleShowChoices = choices => {
    console.log('choices shown!', choices);
    socketHelper.on(SOCKET_EVENTS.PLAYER_VOTED, data => {
      // this.setState(({votes}) => votes.concat(data));
      console.log('a vote!', data);
    });

    socketHelper.emit(SOCKET_EVENTS.SHOW_CHOICE, {
      choices: choices.map((choice, index) => ({
        title: choice.title,
        index,
      }))
    });
  }

  handleVoteEnding = () => {
    console.log('setting the choice to index 1!!');
    // socketHelper.off(SOCKET_EVENTS.PLAYER_VOTED);
    // socketHelper.emit(SOCKET_EVENTS.REMOVE_CHOICE, choices);
    // this.interactiveVideoRef.current.setChoice(getMaxVote(this.state.votes));
    this.interactiveVideoRef.current.setChoice(1);
  }

  handleRemoveChoices = () => {
    // this.setState({
    //   votes: [],
    // });
    console.log('remove choices!');
  }

  render () {
    const { playing, volume, playbackRate, fullScreen, sharedViewing, votes } = this.state;
    const rootClass = 'video-demo' + (fullScreen ? '--fs' : '');
    const handleShowChoices = sharedViewing ? this.handleShowChoices : null;
    const handleRemoveChoices = sharedViewing ? this.handleRemoveChoices : null;
    const handleVoteEnding = sharedViewing ? this.handleVoteEnding : null;

    return (
      <div className={rootClass} ref={this.rootRef}>
        {
          votes.length > 0
            ? (
              <ul className="votes">
                {
                  votes.map(vote => <li>{vote}</li>)
                }
              </ul>
            )
            : null
        }
        <InteractiveVideo
          ref={this.interactiveVideoRef}
          nodes={this.nodes}
          assetRoot={`/assets/movies/timemachine/`}
          Choices={Choices}
          handleLoad={this.play}
          handleShowChoices={this.handleShowChoices}
          handleVoteEnding={this.handleVoteEnding}
          handleRemoveChoices={this.handleRemoveChoices}
          sharedViewing = {!!this.props.sessionId}
          {...this.state} />
        <VideoControls>
          <IconButton icon={playing ? 'pause' : 'play'}
            className="video-control-btn"
            handleOnClick={playing ? this.pause : this.play}
          />
          <IconButton icon="stepBackward"
            className="video-control-btn"
            handleOnClick={this.stepBackward}
            debounceRate={250}
          />
          <IconButton icon="stepForward"
            className="video-control-btn"
            handleOnClick={this.stepForward}
            debounceRate={250}
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

export default ({ movie, sessionId }) => {
  if (!movie) {
    movie = useRouteData().movie;
  }
  return (
    <Movie movie={movie} sessionId={sessionId} />
  );
}
