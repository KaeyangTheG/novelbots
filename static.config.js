import path from 'path'
import { MongoMemoryServer } from 'mongodb-memory-server';
import axios from 'axios'

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
        children: movies.reduce(
          (pages, movie) => {
            return pages.concat(
              {
                path: `/${movie.id}`,
                template: 'src/containers/Movie.js',
                getData: () => ({
                  movie,
                }),
              },
              {
                path: `/${movie.id}/intro`,
                template: 'src/containers/MovieIntro.js',
                getData: () => ({
                  movie,
                }),
              }
            );
          },
          [],
        ),
      },
    ];
  },
  devServer: {
    before: function () {
      const mongod = new MongoMemoryServer();
    },
    proxy: {
      "/api/movies": {
        "target": "http://localhost:3008",
      },
      "/api": {
        "target": "http://localhost:5000",
      },
      '/socket.io': {
        target: 'http://localhost:5000',
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
