const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { hmrClient } = require('rax-compile-config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const setCSSRule = require('../../../utils/setCSSRule');
const { configHTMLPlugin } = require('../../../utils/htmlInjection');

module.exports = (config, context, options) => {
  const { entries } = options;

  const entrieKeys = Object.keys(entries);

  entrieKeys.forEach((entryKey) => {
    config
      .entry(entryKey)
      .add(hmrClient)
      .add(entries[entryKey]);

    config.plugin(entrieKeys.length > 1 ? `HtmlWebpackPlugin_${entryKey}` : 'HtmlWebpackPlugin').use(HtmlWebpackPlugin, [
      {
        inject: false,
        filename: entryKey,
        chunks: [entryKey],
        template: path.resolve(__dirname, '../../../template/demo.html'),
      },
    ]);
  });

  // custom html config
  configHTMLPlugin(config);

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
