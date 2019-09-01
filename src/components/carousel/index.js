import React from 'react';

import { IconButton } from '../icon';
import './styles.css';

class Carousel extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      currentIndex: 0,
      lastIndex: Math.ceil(props.children.length / 5) - 1,
    };
    this.carouselRef = React.createRef();
  }

  moveCarousel(index) {
    this.setState(({ lastIndex }) => ({
      currentIndex: Math.min(Math.max(index, 0), lastIndex),
    }), () => {
      this.carouselRef.current.style =
        `transform: translateX(${-1 * index * 100}%);`
    });
  }

  render() {
    const { children } = this.props;
    const { currentIndex, lastIndex } = this.state;

    return (
      <div className="carousel">
        <div ref={this.carouselRef} className="carousel__items-container">
          {
            children.map(child => (
              <div className="carousel__items-container__item">
                {child}
              </div>
            ))
          }
        </div>
        {
          currentIndex !== 0
            ? (
              <div className="carousel__arrow-container prev">
                <IconButton
                  icon="angle-left"
                  handleOnClick={
                    () => this.moveCarousel(currentIndex - 1)
                  }
                />
              </div>
            )
            : null
        }
        {
          currentIndex < lastIndex
            ? (
              <div className="carousel__arrow-container">
                <IconButton
                  icon="angle-right"
                  handleOnClick={
                    () => this.moveCarousel(currentIndex + 1)
                  }
                />
              </div>
            )
            : null
        }
      </div>
    )
  }
}

export default Carousel;
