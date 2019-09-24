import path from 'path'
import axios from 'axios'
const express = require('express')
const http = require('http');
const socketIO = require('socket.io');

export default {
  getRoutes: async () => {
    const { data: movies } = await axios.get(
      'http://localhost:3008/movies'
    );
    
    return [
      {
        path: '/',
        getData: () => ({
          movies,
        }),
      },
      {
        path: '/movies',
        getData: () => ({
          movies,
        }),
        children: movies.map(
          movie => {
            return ({
              path: `/${movie.id}`,
              template: 'src/containers/Movie.js',
              getData: () => ({
                movie,
              })
            });
          }
        ),
      },
    ];
  },
  devServer: {
    before: function() {
      const server = http.Server(express());
      const io = socketIO(server);
      io.on('connection', socket => {});
      server.listen(4008, () => {
        console.log('socket io listening on port 4008');
      });
    },
    proxy: {
      "/api": {
        "target": "http://localhost:3008",
      },
      '/socket.io': {
        target: 'http://localhost:4008',
        ws: true
      }
    },
  },
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
