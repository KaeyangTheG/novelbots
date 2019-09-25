import React from 'react';
import axios from 'axios';
import {socketHelper, SOCKET_EVENTS} from '../util/socket';

class Play extends React.Component {
    state = {
        displayName: '',
        verifiedSession: false,
        error: '',
        submitted: false,
    };
    componentDidMount() {
        // verify that the session id in the param is valid
        // hide everything until this checks out
        // GET /api/sessions/{id}/status
        axios.get(`/api/sessions/${sessionId}`)
            .then(() => {
                this.setState({verifiedSession: true, error: false});
            })
            .catch(() => {
                this.setState({verifiedSession: false, error: 'Session is not valid'});
            });
    }
    handleSubmit (event) {
        event.preventDefault();
        this.setState({
            submitted: true,
        }, () => {
            const {sessionId} = this.props;
            axios.post(`/api/sessions/${sessionId}/players`, { displayName })
                .then(() => {
                    socketHelper.emit(SOCKET_EVENTS.PLAYER_JOINED, { displayName });
                })
                .catch(() => {
                    this.setState({
                        error: 'Could not join the session :('
                    });
                });
        });
    }
    render() {
        const {sessionId} = this.props;
        const {displayName, verifiedSession, error, submitted} = this.state;
        
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
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label for="displayname">Display name: </label>
                    <input id="displayname" type="text" value={displayName} />
                    <button disabled={submitted}>Submit</button>
                </form>
            </div>
        );
    }
}

export default Play;