import React from 'react';
import axios from 'axios';
import MovieContainer from '../containers/Movie';

class MoviePage extends React.Component {
    state = {
        movie: null,
    };
    
    componentDidMount() {
       const { id } = this.props;
       
       axios.get(`/api/movies/${id}`)
        .then(({data: movie}) => {
            this.setState({
                movie,
            });
        });
    }

    render () {
      const {movie} = this.state;
      const {sessionId} = this.props;
      return (
          movie !== null
            ? (
                <MovieContainer movie={movie} sessionId={sessionId}/>
            )
            : null
      )  
    }
}

export default MoviePage;