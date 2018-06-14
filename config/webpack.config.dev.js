var path = require('path');

module.exports = {
  mode: 'development',

  entry: './build/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },

  devServer: {
    clientLogLevel: 'warning',
    //(!) shouldn't use this option in production
    //https://github.com/webpack/webpack-dev-server/releases/tag/v2.4.3
    disableHostCheck: true,
    historyApiFallback: {
      index: '/public/',
      disableDotRule: true,
      verbose: true,
    },
    host: '0.0.0.0',
    hot: true,
    port: 8000,
  },
}