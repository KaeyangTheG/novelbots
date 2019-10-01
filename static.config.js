import path from 'path'
const data = require(path.join(__dirname, 'backend', 'db.json'));

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
        path: '/games',
        getData: () => ({
          movies,
        }),
        children: movies.map(movie => ({
            path: `/${movie.id}`,
            template: 'src/containers/MovieIntro.js',
            getData: () => ({
              movie,
            }),
        })),
      },
      {
        path: '/movies',
        getData: () => ({
          movies,
        }),
        children: movies.map(movie => ({
          path: `/${movie.id}`,
          template: 'src/containers/Movie.js',
          getData: () => ({
            movie,
          }),
        })),
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
