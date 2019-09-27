import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Link } from '../components/Router';
import { useRouteData } from 'react-static';
import { socketHelper, SOCKET_EVENTS } from '../util/socket';

class MovieIntro extends React.Component {
    state = {
        sessionId: null,
        players: [],
    }
    componentDidMount() {
        axios.post('/api/sessions')
            .then(({data}) => {
                const sessionId = data.sessionId;
                this.socket = io(sessionId);
                Promise.resolve(sessionId);
            })
            .then(sessionId => {
                this.setState({
                    sessionId: data.sessionId,
                });
                this.socket.on(SOCKET_EVENTS.PLAYER_JOINED, data => {
                    this.setState(({players}) => ({
                        players: players.concat(data),
                    }));
                });
            });
        // DEBUGGING
        window.socket = io();
    }
    render() {
        const { id, name, synopsis, thumbnail } = this.props.movie;
        const { sessionId, players } = this.state;
        return (
            sessionId
                ? (
                    <div>
                        <h2>{name}</h2>
                        <h4>{synopsis}</h4>
                        <div>
                            <img src={thumbnail} alt={name} />
                        </div>
                        <div>
                            <h3>
                                Visit <Link to={`/play/${sessionId}`}>{`${window.location.host}/play/${sessionId}`}</Link> to play!
                            </h3>
                        </div>
                        <h3>Audience members joined:</h3>
                        {
                            players.length > 0
                                ? (
                                    <ul>
                                        {
                                            players.map(
                                                ({displayName}) => <li>{displayName}</li>
                                            ) 
                                        }   
                                    </ul>
                                )
                                : null
                        }
                        <Link to={`/movies/${id}/${sessionId}`}>
                            Begin the film!
                        </Link>
                    </div>
                )
                : (
                    <div>
                        Fetching Session Id.....
                    </div>
                )
        );
    }
}

export default () => {
    const { movie } = useRouteData();
    return (
        <MovieIntro movie={movie} />
    );
}
