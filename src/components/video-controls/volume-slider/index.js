import React from 'react';
import IconButton from '../icon-button';
import Slider from '../slider';
import './styles.css';

class VolumeSlider extends React.Component {
  render () {
    const {handleVolumeChange, handleClick, volume} = this.props;

    return (
      <div className="volume-slider">
        <div className="icon-container">
          <IconButton className="video-control-btn"
            handleOnClick={handleClick}
            icon={volume > 0 ? 'volumeUp' : 'volumeMute'}
          />
        </div>
        <Slider
          min={0}
          max={100}
          value={volume}
          handleChange={handleVolumeChange}
        />
      </div>
    );
  }
}

export default VolumeSlider;
