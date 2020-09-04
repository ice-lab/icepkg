const { setComponentConfig } = require('miniapp-compile-config');

const getWebpackBase = require('../getBaseWebpack');
const getOutputPath = require('./getOutputPath');

module.exports = (context, target, options = {}, onGetWebpackConfig) => {
  const { entryPath = './src/index', distDir = '' } = options[target] || {};
  const outputPath = getOutputPath(context, { target, distDir });
  const config = getWebpackBase(context, {
    disableRegenerator: true
  });

  setComponentConfig(config, options[target], {
    onGetWebpackConfig,
    context,
    entryPath,
    outputPath,
    target
  });

  return config;
};
