import React from 'react';

import Button from '../button';
import './styles.css';

class PreviewBanner extends React.Component {
  render () {
    const {id, name, synopsis, preview={}} = this.props;
    const {poster, src} = preview;

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
            // <video poster="" src=""></video>
          }
        </div>
      </div>
    );
  }
}

export default PreviewBanner;
