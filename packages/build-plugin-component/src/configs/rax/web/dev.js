const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { hmrClient } = require('rax-compile-config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const setCSSRule = require('../../../utils/setCSSRule');

module.exports = (config, context, options) => {
  const { entries } = options;

  Object.keys(entries).forEach((entryKey) => {
    config
      .entry(entryKey)
      .add(hmrClient)
      .add(entries[entryKey]);

    config.plugin(`html4${entryKey}`).use(HtmlWebpackPlugin, [
      {
        inject: true,
        filename: entryKey,
        chunks: [entryKey],
        template: path.resolve(__dirname, '../../../template/demo.hbs'),
      },
    ]);
  });

  config.output
    .filename('[name].js');
  setCSSRule(config, options.inlineStyle);
  // Extract css for SSR dev server
  config.plugin('minicss')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].css',
    }]);

  // rewrite a request that matches the /\/index/ pattern to /index.html.
  config.devServer.set('historyApiFallback', true);

  return config;
};
