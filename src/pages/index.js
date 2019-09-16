import React from 'react'
import Boxart from '../components/boxart';
import Carousel from '../components/carousel';
import PreviewBanner from '../components/preview-banner';
import { useRouteData } from 'react-static';

class Lander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  render() {
    const {selected} = this.state;
    const {movies} = this.props;
    const {id, name, synopsis, preview} = movies[selected];

    return (
      <>
        <header className="container header">
          <h1>
            Novelbots
          </h1>
        </header>
        <div className="container">
          <h3>Interactive Films</h3>
          <Carousel>
            {
              movies.map(({id, thumbnail, name}, index) => (
                <Boxart
                  selected={selected === index}
                  src={thumbnail}
                  alt={name}
                  link={`/movies/${id}`}
                  handleClick={() => this.setState({ selected: index })}
                />
              ))
            }
          </Carousel>
        </div>
        <PreviewBanner
          id={id}
          name={name}
          synopsis={synopsis}
          preview={preview}
          link={`/movies/${id}`}
        />
      </>
    );
  }
}

export default () => {
  const { movies } = useRouteData();
  return <Lander movies={movies} />;
};
