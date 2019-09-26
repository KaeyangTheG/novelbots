import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Link, Router } from 'components/Router'
import Dynamic from 'containers/Dynamic'
import Play from 'containers/Play';
import Movie from 'pages/Movie';

import './app.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Root>
      <div className="main">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            <Movie path="movies/:id/:sessionId" />
            <Play path="play/:sessionId" />
            <Dynamic path="dynamic" />
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </div>
    </Root>
  )
}

export default App
