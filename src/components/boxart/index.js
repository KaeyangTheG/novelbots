import React from 'react';

import './styles.css';

export default ({ selected, src, alt, handleClick }) => (
  <div style={{position: "relative"}}>
    <div className="boxart" onClick={handleClick}>
      <img className="boxart__img" src={src} alt={alt} />
    </div>
    {
      selected ? <div className="boxart__focus-ring" /> : null
    }
  </div>
);
