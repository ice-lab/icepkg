const setCSSRule = require('../../../utils/setCSSRule');

module.exports = (config, context, options) => {
  const { entries } = options;

  Object.keys(entries).forEach((entryKey) => {
    config
      .entry(entryKey)
      .add(entries[entryKey]);
  });

  config.output
    .filename('kraken/[name].js');

  // as for kraken, force inline style
  setCSSRule(config, true);

  // remove hot reload for kraken
  config.devServer
    .hot(false)
    .inline(false);

  return config;
};
