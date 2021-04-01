const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { hmrClient } = require('rax-compile-config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const setCSSRule = require('../../../utils/setCSSRule');
const defaultConfig = require('./defaultConfig.js');
const { configHTMLPlugin, configHTMLContent, configWebpack } = require('../../../utils/htmlInjection');

module.exports = (config, context, options) => {
  const { entries } = options;
  const { userConfig } = context;

  // set default content of html
  configHTMLContent(defaultConfig);

  // config htmlInjection for once
  if (userConfig.htmlInjection) {
    configWebpack(userConfig.htmlInjection);
  }

  const entrieKeys = Object.keys(entries);

  entrieKeys.forEach((entryKey) => {
    config
      .entry(entryKey)
      .add(hmrClient)
      .add(entries[entryKey]);

    config.plugin(entrieKeys > 1 ? `HtmlWebpackPlugin_${entryKey}` : `HtmlWebpackPlugin`).use(HtmlWebpackPlugin, [
      {
        inject: false,
        filename: entryKey,
        chunks: [entryKey],
        template: path.resolve(__dirname, '../../../template/demo.html'),
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
