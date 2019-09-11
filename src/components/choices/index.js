import React from 'react';
import { CSSTransition } from 'react-transition-group';

import Timer from './timer';
import styles from './styles.css';

const ChoiceButton = ({selected, title, handleOnClick, style}) => (
  <button style={style}
    className={selected ? 'selected' : ''}
    onClick={handleOnClick}>
    {title}
  </button>
);

class Choices extends React.Component {
  render() {
    const {
      choices,
      choiceDuration,
      playbackRate,
      selected,
      handleOnClick,
      showing
    } = this.props;

    return (
      <CSSTransition
        in={showing}
        timeout={1000}
        unmountOnExit
        classNames="choiceui"
      >
        <div style={{position: 'relative'}}>
          <Timer duration={choiceDuration} playbackRate={playbackRate} />
            <div className={`choices ${selected !== null ? 'selected' : ''}`}>
              {
                choices.map(({title}, index) => (
                  <ChoiceButton
                    key={title}
                    title={title}
                    selected={selected === index}
                    handleOnClick={
                      handleOnClick ? () => handleOnClick(index) : null
                    }
                  />
                ))
              }
            </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Choices;
