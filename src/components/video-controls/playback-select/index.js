import React from 'react';
import styles from './styles.css';

const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default ({value, handleOnChange}) => (
  <select className="playback-selector"
    value={value} onChange={handleOnChange}>
    {
      playbackRates.map(rate => <option value={rate}>{rate}</option>)
    }
  </select>
)
