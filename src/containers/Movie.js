import React from 'react'
import { useRouteData } from 'react-static'

export default function Post() {
  const { movie } = useRouteData()
    
  return (
    <div>
      <p>{movie.name}</p>
      <p>{movie.synopsis}</p>
    </div>
  );
}
