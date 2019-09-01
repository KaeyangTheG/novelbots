import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faAngleLeft,
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
  'angle-right': faAngleRight,
  'angle-left': faAngleLeft,
  'compress': faCompress,
  'expand': faExpand,
  'play': faPlay,
  'pause': faPause,
  'stepForward': faStepForward,
  'stepBackward': faStepBackward,
  'volumeUp': faVolumeUp,
  'volumeMute': faVolumeMute,
};

export const Icon = ({className, icon }) => (
  <FontAwesomeIcon className={className || ''} icon={iconMap[icon]} />
);

export const IconButton = ({
  buttonClassName,
  iconClassName,
  icon,
  handleOnClick
}) => (
  <button className={`icon-button ${buttonClassName || ''}`}
    onClick={handleOnClick}>
    <Icon className={iconClassName || ''} icon={icon} />
  </button>
);
