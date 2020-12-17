const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { hmrClient } = require('rax-compile-config');
const getBaseWebpack = require('./getBaseWebpack');
const generateRaxDemo = require('../../utils/generateRaxDemo');
const setCSSRule = require('../../utils/setCSSRule');

module.exports = (context, options) => {
  const { command, rootDir } = context;
  const { demos, entries, herboxName } = options;
  const config = getBaseWebpack(context, { ...options, name: 'demo' });
  const portalPath = generateRaxDemo(demos, context, herboxName);
  if (command === 'start') {
    config
      .entry('portal')
      .add(hmrClient)
      .add(portalPath);
  } else {
    config.entry('portal').add(portalPath);
  }

  config.output.filename('[name].js');
  config.output.publicPath('./');
  config.output.path(path.join(rootDir, 'build'));
  setCSSRule(config, command !== 'start');
  if (command === 'start') {
    config.output.publicPath('/demo');
  } else {
    Object.keys(entries).forEach((entryKey) => {
      config
        .entry(`demo/${entryKey}`)
        .add(entries[entryKey]);

      config.plugin(`html4${entryKey}`).use(HtmlWebpackPlugin, [
        {
          inject: true,
          filename: `demo/${entryKey}.html`,
          chunks: [entryKey],
          jsPath: `./${entryKey}.js`,
          template: path.resolve(__dirname, '../../template/raxDemo.html'),
        },
      ]);
    });
    config.plugin('minicss').use(MiniCssExtractPlugin, [
      {
        filename: '[name].css',
      },
    ]);
  }

  config.plugin('html').use(HtmlWebpackPlugin, [
    {
      inject: true,
      filename: command === 'start' ? 'portal' : 'index.html',
      chunks: ['portal'],
      template: path.resolve(__dirname, '../../template/raxPortal.html'),
    },
  ]);

  return config;
};
