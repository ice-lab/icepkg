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
        inject: false,
        filename: entryKey,
        chunks: [entryKey],
        templateParameters: {
          htmlAttrs: '',
          headPrepend: [
            '<meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<meta http-equiv="X-UA-Compatible" content="ie=edge">',
          ].join(''),
          headAppend: ['<title>DEMO 预览</title>'],
          rootContainer: '<div id="root"></div>',
          bodyPrepend: '',
          bodyAppend: '',
          bodyAttrs: '',
        },
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
