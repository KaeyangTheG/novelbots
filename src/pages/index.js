import React from 'react'
import Boxart from '../components/boxart';
import Carousel from '../components/carousel';
import PreviewBanner from '../components/preview-banner';

const samples = [
  {
    id: 1,
    name: 'The Time Machine',
    synopsis: `Chat, Matt and Rob will do anything to avoid hard work. If this means
    travelling through time pursued by zombies and gun-toting agents then so be it.`,
    thumbnail: '/assets/boxart/timemachine.webp',
    preview: {
      poster: '/assets/posters/timemachine.png',
      src: '/assets/trailers/timemachine.webm',
    }
  },
  {
    id: 2,
    name: '"Prince" Ali of Babwa',
    synopsis: `Based on a true story, an impoverished street rat cons his way into the royal palace with the help of
      demonic allies. Can he win over princess Jasmine and stay true to himself?`,
    thumbnail: '/assets/boxart/aladdin.webp',
    preview: {
      poster: '/assets/posters/aladdin.webp',
      src: '/assets/trailers/mulan.mp4',
    }
  },
  {
    id: 3,
    name: 'The Choice',
    synopsis: `A British romantic drama about a boy and his records just
      before the great video game collapse of 1984.`,
    thumbnail: '/assets/boxart/bandersnatch.webp',
    preview: {
      poster: '/assets/posters/bandersnatch.webp',
      src: '/assets/trailers/music.mp4',
    }
  },
  {
    id: 4,
    name: 'The Meme Father',
    synopsis: `The Godfather, Vito Corleone, must choose
    whether to invest in the drug baron Virgil Sollozzo. The fate of the galaxy may rest on his decision.`,
    thumbnail: '/assets/boxart/godfather.webp',
    preview: {
      poster: '/assets/posters/godfather2.webp',
      src: '/assets/trailers/godfather.mp4',
    }
  },
  {
    id: 5,
    name: 'Indiana Jones and the second Last Crusade',
    synopsis: `Millionaire Harrison Ford must once again don the hat of his alter ego, Indiana Jones,
      in order to irrefutably prove that Christianity is true.`,
    thumbnail: '/assets/boxart/indy.webp',
    preview: {
      poster: '/assets/posters/indy.webp',
      src: '/assets/trailers/jones.mp4',
    }
  }
];

const sample = samples[4];

class Lander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  render() {
    const {selected} = this.state;
    const sample = samples[selected];

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
              samples.map(({thumbnail, name}, index) => (
                <Boxart
                  selected={selected === index}
                  src={thumbnail}
                  alt={name}
                  handleClick={() => this.setState({ selected: index })}
                />
              ))
            }
          </Carousel>
        </div>
        <PreviewBanner
          id={sample.id}
          name={sample.name}
          synopsis={sample.synopsis}
          preview={sample.preview}
        />
      </>
    );
  }
}

export default Lander;
