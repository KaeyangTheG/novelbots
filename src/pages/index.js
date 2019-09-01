import React from 'react'
import Boxart from '../components/boxart';
import Carousel from '../components/carousel';
import PreviewBanner from '../components/preview-banner';

const sample = {
  id: 1,
  name: 'The Time Machine',
  synopsis: `Chat, Matt and Rob will do anything to avoid hard work.  If this means
  travelling through time pursued by zombies and gun-toting agents then so be it.`,
  preview: {
    poster: '/assets/timemachine.png',
  }
};

export default () => (
  <>
    <div className="container">
      <h3>Interactive Films</h3>
      <Carousel>
        <Boxart src="/assets/timemachine.webp" alt="title preview" />
        <Boxart src="/assets/aladdin.webp" alt="title preview" />
        <Boxart src="/assets/bandersnatch.webp" alt="title preview" />
        <Boxart src="/assets/godfather.webp" alt="title preview" />
        <Boxart src="/assets/indy.webp" alt="title preview" />
        <Boxart src="/assets/lion.jpg" alt="title preview" />
        <Boxart src="/assets/sunset.jpg" alt="title preview" />
        <Boxart src="/assets/woods.jpg" alt="title preview" />
        <Boxart src="/assets/woods.jpg" alt="title preview" />
        <Boxart src="/assets/everest.jpg" alt="title preview" />
        <Boxart src="/assets/lion.jpg" alt="title preview" />
        <Boxart src="/assets/sunset.jpg" alt="title preview" />
        <Boxart src="/assets/woods.jpg" alt="title preview" />
      </Carousel>
    </div>
    <PreviewBanner
      id={sample.id}
      name={sample.name}
      synopsis={sample.synopsis}
      preview={sample.preview}
    />
  </>
)
