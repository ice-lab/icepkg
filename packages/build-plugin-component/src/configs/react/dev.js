const setAssetsPath = require('../../utils/setAssetsPath');

module.exports = (config, options) => {
  const { https } = options;
  setAssetsPath(config, { js: 'js', css: 'css' });
  // config loglevel
  config.merge({
    devServer: {
      logLevel: 'silent',
    },
  });
  config.devServer
    .hot(true)
    .disableHostCheck(true)
    .clientLogLevel('silent');

  config.devServer.https(Boolean(https));
};
