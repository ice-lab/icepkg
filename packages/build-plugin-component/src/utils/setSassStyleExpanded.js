module.exports = (config) => {
  ['scss', 'sass'].forEach((ruleName) => {
    if (config.module.rules.get(ruleName) && config.module.rules.get(ruleName).uses.has('sass-loader')) {
      config
        .module
        .rules
        .get(ruleName)
        .use('sass-loader')
        .tap((opts) => ({
          ...opts,
          sassOptions: {
            outputStyle: 'expanded',
          },
        }));
    }
  });
};
