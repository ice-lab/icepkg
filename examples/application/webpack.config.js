const path = require('path');

module.exports = {
  mode: 'development',
  optimization: {
    minimize: false,
  },

  devtool: 'inline-source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },

    devMiddleware: {
      writeToDisk: true,
    },

    compress: true,
    port: 9000,
  },

  // resolve: {
  //   conditionNames: ['esnext'],
  // },
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
};
