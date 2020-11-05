const { hmrClient } = require('rax-compile-config');
const WeexFrameworkBanner = require('../../../webpackPlugins/weex/WeexFrameworkBannerPlugin');
const setCSSRule = require('../../../utils/setCSSRule');

module.exports = (config, context, options) => {
  const { entries } = options;

  Object.keys(entries).forEach((entryKey) => {
    config
      .entry(entryKey)
      .add(hmrClient)
      .add(entries[entryKey]);
  });

  config.output
    .filename('weex/[name].js');

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  setCSSRule(config, true);

  return config;
};
