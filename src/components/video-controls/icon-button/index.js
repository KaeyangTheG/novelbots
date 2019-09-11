import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faCompress,
  faExpand,
  faVolumeUp,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const iconMap = {
  'compress': faCompress,
  'expand': faExpand,
  'play': faPlay,
  'pause': faPause,
  'stepForward': faStepForward,
  'stepBackward': faStepBackward,
  'volumeUp': faVolumeUp,
  'volumeMute': faVolumeMute,
};

export default ({className, icon, handleOnClick}) => (
  <button className="icon-button" onClick={handleOnClick}>
    <FontAwesomeIcon className={className} icon={iconMap[icon]} />
  </button>
)
