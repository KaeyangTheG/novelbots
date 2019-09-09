import path from 'path'
import axios from 'axios'

export default {
  getRoutes: async () => {
    const { data: movies } = await axios.get(
      'http://localhost:3008/movies'
    );
    
    return [
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
    proxy: {
      "/api": {
        "target": "http://localhost:3008",
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
