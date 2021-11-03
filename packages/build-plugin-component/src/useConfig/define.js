module.exports = (config, define, context) => {
  const defineVariables = {};

  Object.keys(define).forEach((defineKey) => {
    defineVariables[defineKey] = JSON.stringify(define[defineKey]);
  });

  if (config.plugins.get('DefinePlugin')) {
    config
      .plugin('DefinePlugin')
      .tap((args) => [Object.assign(...args, defineVariables)]);
  } else {
    const { webpack } = context;
    config.plugin('DefinePlugin')
      .use(webpack.DefinePlugin, [defineVariables]);
  }
};
