module.exports = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  resolve: {
    conditionNames: ['es2017'],
  },
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
