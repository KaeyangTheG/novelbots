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

const debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export const Icon = ({className, icon }) => (
  <FontAwesomeIcon className={className || ''} icon={iconMap[icon]} />
);

export const IconButton = ({
  buttonClassName,
  iconClassName,
  icon,
  handleOnClick,
  debounceRate = 0,
}) => (
  <button className={`icon-button ${buttonClassName || ''}`}
    onClick={debounce(handleOnClick, debounceRate)}>
    <Icon className={iconClassName || ''} icon={icon} />
  </button>
);
