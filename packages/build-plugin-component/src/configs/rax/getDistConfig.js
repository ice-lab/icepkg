const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getBaseWebpack = require('./getBaseWebpack');
const setCSSRule = require('../../utils/setCSSRule');

module.exports = (context, options) => {
  const config = getBaseWebpack(context, options);
  const { rootDir } = context;
  const { entryName = 'index' } = options;

  config.entry(entryName)
    .add(path.resolve(rootDir, 'src/index'));

  config.externals([
    function (ctx, request, callback) {
      if (request.indexOf('@weex-module') !== -1) {
        return callback(null, `commonjs ${request}`);
      }
      // Built-in modules in QuickApp
      if (request.indexOf('@system') !== -1) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
    nodeExternals(),
  ]);
  // 输出到 dist 目录
  config.output.path(path.join(rootDir, 'dist'));

  setCSSRule(config, options.inlineStyle);
  config.plugin('minicss')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].css',
    }]);

  return config;
};
