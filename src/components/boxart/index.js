import React from 'react';

import './styles.css';

export default ({ src, alt, handleClick }) => (
  <div className="boxart" onClick={handleClick}>
    <img className="boxart__img" src={src} alt={alt} />
  </div>
);
