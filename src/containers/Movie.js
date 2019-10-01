import React from 'react'
import axios from 'axios';
import Choices from '../components/choices';
import InteractiveVideo from '../components/interactive-video';
import VideoControls from '../components/video-controls';
import { IconButton } from '../components/icon';
import VolumeSlider from '../components/video-controls/volume-slider';
import PlaybackSelect from '../components/video-controls/playback-select';
import { useRouteData } from 'react-static'
import { SOCKET_EVENTS } from '../util/socket';
import io from 'socket.io-client';

import './styles.css';

const getMaxVote = votes => {
  if (!votes || !Object.keys(votes).length) {
    return 0;
  }

  return votes[
      Object.keys(votes).sort((a, b) => {
      return votes[b].length - votes[a].length;
    })[0]
  ][0].choice.index;
};

class Movie extends React.Component {
  rootRef = React.createRef();
  interactiveVideoRef = React.createRef();

  constructor(props) {
    super(props);
    const {sessionId} = props;
    this.rootRef = React.createRef();
    this.interactiveVideoRef = React.createRef();
    this.nodes = props.movie.nodes;
    this.state = {
      volume: 0,
      playing: false,
      playbackRate: 1,
      fullScreen: false,
      sharedViewing: !!sessionId,
      votes: {},
      sessionVerified: false,
      invalidSession: false,
    };
    if (!!sessionId) {
      this.socket = io.connect();
      this.socket.on('connect', () => {
        this.socket.emit(SOCKET_EVENTS.CREATE_ROOM, sessionId);
      });
    }
  }

  componentDidMount() {
    if (this.state.sharedViewing && !this.state.sessionVerified) {
      axios.get(`/api/sessions/${this.props.sessionId}`)
        .then(() => {
          this.setState({
            sessionVerified: true,
          });
        })
        .catch(() => {
          this.setState({
            invalidSession: true,
          });
        });
        return;
    }
    this.rootRef.current.addEventListener('fullscreenchange', () => {
      this.setState({
        fullScreen: document.fullscreenElement !== null
      });
    });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.sessionVerified && !prevState.sessionVerified) {
      this.rootRef.current.addEventListener('fullscreenchange', () => {
        this.setState({
          fullScreen: document.fullscreenElement !== null
        });
      });
    }
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
    this.socket.on(SOCKET_EVENTS.PLAYER_VOTED, ({choice, displayName}) => {
      this.setState(({ votes }) => {
        return {
          votes: {
            ...votes,
            [choice.title]: Array.isArray(votes[choice.title])
              ? votes[choice.title].concat({choice, displayName}) 
              : [{choice, displayName}],
          },
        };
      });
    });

    this.socket.emit(SOCKET_EVENTS.SHOW_CHOICE, {
      choices: choices.map((choice, index) => ({
        title: choice.title,
        index,
      }))
    });
  }

  handleVoteEnding = () => {
    const theVote = getMaxVote(this.state.votes);
    this.socket.off(SOCKET_EVENTS.PLAYER_VOTED);
    this.socket.emit(SOCKET_EVENTS.REMOVE_CHOICE);
    
    this.interactiveVideoRef.current.setChoice(theVote);
  }

  handleRemoveChoices = () => {
    this.setState({
      votes: {},
    });
  }

  render () {
    const {
        playing,
        volume,
        playbackRate,
        fullScreen,
        sharedViewing,
        votes,
        sessionVerified,
        invalidSession,
    } = this.state;
    const rootClass = 'video-demo' + (fullScreen ? '--fs' : '');
    const handleShowChoices = sharedViewing ? this.handleShowChoices : null;
    const handleRemoveChoices = sharedViewing ? this.handleRemoveChoices : null;
    const handleVoteEnding = sharedViewing ? this.handleVoteEnding : null;
    
    if (invalidSession) {
      return <div>Invalid session!</div>;
    }

    if (!sessionVerified && sharedViewing) {
      return <div>Verifying session</div>;
    }

    return (
      <div className={rootClass} ref={this.rootRef}>
        {
          Object.keys(votes).length > 0
            ? (
              <div className="votes">
                <ul>
                  {
                    Object.keys(votes).map(
                      key => (
                      <li>
                        <div>
                          <h5>{key}: {votes[key].length}</h5>
                          <ul>
                            {
                              votes[key].map(({displayName}) => <li>{displayName}</li>)
                            }
                          </ul>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
            : null
        }
        <InteractiveVideo
          ref={this.interactiveVideoRef}
          nodes={this.nodes}
          assetRoot={`/assets/movies/timemachine/`}
          Choices={Choices}
          handleLoad={this.play}
          handleShowChoices={handleShowChoices}
          handleVoteEnding={handleVoteEnding}
          handleRemoveChoices={handleRemoveChoices}
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
