import React from 'react';

import { IconButton } from '../icon';
import './styles.css';

export default ({ selected, src, alt, link, handleClick }) => (
  <div style={{position: "relative"}}>
    <div className="boxart" onClick={handleClick}>
      <img className="boxart__img" src={src} alt={alt} />
    </div>
    {
      selected
      ? (
        <a href={link}>
          <div className="boxart__focus-ring">
            <div className="boxart__focus-ring__play">
              <div className="icon-play" />
            </div>
          </div>
        </a>
      )
      : null
    }
  </div>
);
