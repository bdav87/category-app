module.exports = {
  use: [
    ['@neutrinojs/react', {
        html: {
          title: 'Category App'
        },
        devServer: {
          /* proxy: {
            '/test': 'http://localhost:3000'
          } */
          proxy: 'http://localhost:3000'
        }
    }],
    '@neutrinojs/jest'
  ]
};
