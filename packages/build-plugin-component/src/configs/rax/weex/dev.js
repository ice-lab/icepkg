const { hmrClient } = require('rax-compile-config');
const WeexFrameworkBanner = require('../../../webpackPlugins/weex/WeexFrameworkBannerPlugin');
const getBaseWebpack = require('../getBaseWebpack');

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

  config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
    .loader(require.resolve('stylesheet-loader'));

  config.module.rule('less')
    .test(/\.less?$/)
    .use('css')
    .loader(require.resolve('stylesheet-loader'))
    .end()
    .use('less-loader')
    .loader(require.resolve('less-loader'));
  
  config.module.rule('scss')
    .test(/\.scss?$/)
    .use('css')
    .loader(require.resolve('stylesheet-loader'))
    .end()
    .use('sass-loader')
    .loader(require.resolve('sass-loader'));
  return config;
};
