import React from 'react'
import Boxart from '../components/boxart';
import Carousel from '../components/carousel';

export default () => (
  <>
    <div className="container">
      <Carousel>
        <Boxart src="/assets/everest.jpg" alt="title preview" />
        <Boxart src="/assets/lion.jpg" alt="title preview" />
        <Boxart src="/assets/sunset.jpg" alt="title preview" />
        <Boxart src="/assets/woods.jpg" alt="title preview" />
        <Boxart src="/assets/everest.jpg" alt="title preview" />
        <Boxart src="/assets/lion.jpg" alt="title preview" />
        <Boxart src="/assets/sunset.jpg" alt="title preview" />
        <Boxart src="/assets/woods.jpg" alt="title preview" />
      </Carousel>
    </div>
  </>
)
