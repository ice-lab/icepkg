const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getBaseWebpack = require('./getBaseWebpack');
const runtimeFunctionWrapperPlugin = require('../../webpackPlugins/runtimeFunctionWrapperPlugin');
const setCSSRule = require('../../utils/setCSSRule');

module.exports = (context, options) => {
  const config = getBaseWebpack(
    { ...context, command: 'build', commandArgs: {} },
    {
      ...options,
      minify: false,
    },
  );
  const { rootDir } = context;
  const { entryName = 'index', targetDir = path.resolve(rootDir, 'build/ali-miniapp') } = options;
  const entryPath = path.resolve(rootDir, 'node_modules/.runtime-preview-entry/index.jsx');

  config.entry(entryName).add(entryPath);

  config.mode('production');

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
  ]);
  // 输出到 dist 目录

  config.output.path(targetDir);
  config.output.filename('bundle.js');

  setCSSRule(config, options.inlineStyle);

  config.plugin('minicss').use(MiniCssExtractPlugin, [
    {
      filename: 'bundle.css.acss',
    },
  ]);

  config.plugin('runtimeMiniappWrapper').use(runtimeFunctionWrapperPlugin, [
    {
      rootDir,
      targetDir,
    },
  ]);

  return config;
};
