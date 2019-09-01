import React from 'react';

import './styles.css';

export default ({ src, alt }) => (
  <div className="boxart">
    <img className="boxart__img" src={src} alt={alt} />
  </div>
);
