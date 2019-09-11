import React from 'react';

import './styles.css';

class Timer extends React.Component {
    state = {
        appliedAnimation: false,
    }
    animationStyle = {
        transform: 'scaleX(0)',
    };
    componentDidMount() {
        window.setTimeout(() => this.setState({appliedAnimation: true}), 0);
    }
    render() {
        const { duration, playbackRate } = this.props;
        const {appliedAnimation} = this.state;
        const appliedDuration = ((duration || 10) - 0.5) / (playbackRate || 1);

        return (
            <div className="horizontal-timer" style={{
                transition: `${appliedDuration}s transform linear`,
                ... (appliedAnimation ? this.animationStyle : {}),
            }} />
        );
    }
}

export default Timer;
