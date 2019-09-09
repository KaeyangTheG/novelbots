import React from 'react'
import { useRouteData } from 'react-static'

export default function Movie() {
  const { movies } = useRouteData()
  
  return (
    <div>
      <h4>Wow so many movies: {movies ? movies.length : null}</h4>
    </div>
  );
}
