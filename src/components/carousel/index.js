import React from 'react';

import './styles.css';

class Carousel extends React.Component {
  render() {
    const { children, visibleItems } = this.props;

    return (
      <div className="carousel">
        <div className="carousel__items-container">
          {
            children.map(child => (
              <div className="carousel__items-container__item">
                {child}
              </div>
            ))
          }
        </div>
        <div className="carousel__arrow-container">
        </div>
      </div>
    )
  }
}

export default Carousel;
