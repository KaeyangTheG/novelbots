import React from 'react';
import './styles.css';

export default ({className, handleChange, value, ...rest}) => {
  const {min, max} = rest;
  const percentage = Math.floor((value / (max - min)) * 100);
  const gradientStyle = {
    background: `linear-gradient(to right, red 0% ${percentage}%, gray ${percentage}%)`,
  };
  return (
    <div
      className="slide-container">
      <input
        style={gradientStyle}
        type="range"
        className={`slider ${className || ''}`}
        onChange={handleChange}
        value={value}
        {...rest}
      />
    </div>
  );
};
