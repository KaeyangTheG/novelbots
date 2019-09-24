import React from 'react';
import axios from 'axios';
import { Link } from '../components/Router';
import { useRouteData } from 'react-static';

class MovieIntro extends React.Component {
    state = {
        sessionId: null,
    }
    componentDidMount() {
        axios.post('/api/sessions')
            .then(({data}) => {
                this.setState({
                    sessionId: data.sessionId,
                });
            });
    }
    render() {
        const { id, name, synopsis, thumbnail } = this.props.movie;
        const { sessionId } = this.state;
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
