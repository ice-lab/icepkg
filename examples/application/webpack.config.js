module.exports = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  resolve: {
    conditionNames: ['esnext'],
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
