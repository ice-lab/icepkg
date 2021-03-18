const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getBaseWebpack = require('./getBaseWebpack');
const runtimeFunctionWrapperPlugin = require('../../webpackPlugins/runtime/RuntimeFunctionWrapperPlugin');
const setCSSRule = require('../../utils/setCSSRule');
const copyRuntimeMiniappFiles = require('../../utils/copyRuntimeMiniappFiles');

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

  // copy unchanged miniapp files to target dir
  copyRuntimeMiniappFiles(targetDir);

  config.entry(entryName).add(entryPath);

  // `inline` mode insert hot-reload script into bundle
  config.devServer
    .inline(false);

  config.output.path(targetDir);
  config.output.filename('bundle.js');

  // as for runtime miniapp, `inlineStyle` is always `false`
  // for other files depend on `bundle.css.acss`
  setCSSRule(config, false);

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
