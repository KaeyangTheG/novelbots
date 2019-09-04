import React from 'react';

import Button from '../button';
import './styles.css';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

class PreviewBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.videoRef = React.createRef();
  }
  
  componentDidMount() {
    this.waitForVideoLoad();
  }

  componentDidUpdate(prevProps) {
    const {preview} = this.props;
    if (!preview || !prevProps.preview) {
      return;
    }
    if (preview.src === prevProps.preview.src) {
      return;
    }
    if (!(preview.src && prevProps.preview.src)) {
      return;
    }
    this.setState({
      loading: true,
    }, this.waitForVideoLoad) 
  }

  waitForVideoLoad() {
    const video = this.videoRef.current;
    video.addEventListener('loadeddata', () => {
      window.setTimeout(() => {
        video.play();
        this.setState({
          loading: false,
        });
      }, 1000);
    });
  }

  render () {
    const {id, name, synopsis, preview={}} = this.props;
    const {poster, src} = preview;
    const {loading} = this.state;

    return (
      <div className="preview-banner">
        <div className="movie-info">
          <h3 className="movie-info__name">{name}</h3>
          <p className="movie-info__synopsis">{synopsis}</p>
          <Button handleClick={() => {window.location =  `/movie/${id}`; }}>
            <strong>Watch this</strong>
          </Button>
        </div>
        <div className="movie-preview" style={{backgroundImage: `url(${poster})`}}>
          {
            <video
              key={src}
              ref={this.videoRef}
              loop
              muted
              className={`movie-preview__trailer ${loading ? 'loading' : ''}`}
              src={src}
            />
          }
        </div>
      </div>
    );
  }
}

export default PreviewBanner;
