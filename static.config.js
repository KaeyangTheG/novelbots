import path from 'path'
const data = require('./db.json');

export default {
  getRoutes: async () => {
    const { movies } = data;
    
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
    proxy: {
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
