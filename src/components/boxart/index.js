import React from 'react';

export default ({ src, alt }) => (
  <div className="boxart">
    <img className="boxart__img" src={src} alt={alt} />
  </div>
);
