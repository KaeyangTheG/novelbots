import React from 'react';
import axios from 'axios';
import {socketHelper, SOCKET_EVENTS} from '../util/socket';

class Play extends React.Component {
    state = {
        displayName: '',
        verifiedSession: false,
        error: '',
        success: '',
        submitted: false,
        gameStarted: false,
    };
    componentDidMount() {
        // verify that the session id in the param is valid
        // hide everything until this checks out
        // GET /api/sessions/{id}/status
        const {sessionId} = this.props;
        axios.get(`/api/sessions/${sessionId}`)
            .then(() => {
                this.setState({
                    verifiedSession: true,
                    error: '',
                    success: ''
                });
            })
            .catch(() => {
                this.setState({
                    verifiedSession: false,
                    error: 'Session is not valid',
                    success: '',
                });
            });
    }
    handleSubmit (event) {
        event.preventDefault();
        this.setState({
            submitted: true,
        }, () => {
            const {sessionId} = this.props;
            const {displayName} = this.state;
            axios.post(`/api/sessions/${sessionId}/players`, { displayName })
                .then(() => {
                    socketHelper.emit(SOCKET_EVENTS.PLAYER_JOINED, { displayName });
                    this.setState({
                        success: `You are in ${displayName}! Waiting for the film to begin`,
                    });
                })
                // .catch(() => {
                //     this.setState({
                //         error: 'Could not join the session :('
                //     });
                // });
        });
    }
    handleDisplaynameChange = event => {
        this.setState({
            displayName: event.target.value,
        });
    }
    render() {
        const {sessionId} = this.props;
        const {displayName, verifiedSession, error, submitted, success} = this.state;
        
        if (error !== '') {
            return <div>{error}</div>;
        }

        if (!verifiedSession) {
            return <div>Verifying session...</div>;
        }

        return (
            <div>
                <h2>Play along!</h2>
                <h4>Session id: {sessionId}</h4>
                <p>{success}</p>
                {
                    success === ''
                        ? (
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <label for="displayname">Display name: </label><br />
                                <input id="displayname" type="text" value={displayName}
                                    onChange={this.handleDisplaynameChange} /><br />
                                <button disabled={submitted}>Submit</button>
                            </form>
                        ) : null
                }
            </div>
        );
    }
}

export default Play;