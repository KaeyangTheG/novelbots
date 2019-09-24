import React from 'react';

class Play extends React.Component {
    componentDidMount() {
        // verify that the session id in the param is valid
        // hide everything until this checks out
        // GET /api/sessions/{id}/status
    }
    handleSubmit (event) {
        event.preventDefault();
        // POST to /api/sessions/{id}/players
    }
    render() {
        const {sessionId} = this.props;
        return (
            <div>
                <h2>Play along!</h2>
                <h4>Session id: {sessionId}</h4>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label for="displayname">Display name: </label>
                    <input id="displayname" type="text" />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}

export default Play;