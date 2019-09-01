import React from 'react';

import './styles.css';

export default ({children, className, handleClick}) => (
  <button onClick={handleClick}
    className={`button ${className || ''}`}
  >
    {children}
  </button>
);
