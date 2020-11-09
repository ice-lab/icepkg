const _ = require('lodash');
const getDistConfig = require('./getDistConfig');


module.exports = (context, options) => {
  const config = getDistConfig(context, options);
  const {
    library,
    // library target
    libraryTarget = 'umd',
    // library export, default is undefined
    libraryExport,
    filename = 'index.umd.js',
  } = options;
  const { pkg } = context;
  const pkgName = _.camelCase(pkg.name || '');

  config.output
    .library(library || pkgName)
    .libraryTarget(libraryTarget);
  if (libraryExport) {
    config.output.libraryExport(libraryExport);
  }
  config.output.filename(filename);
  return config;
};
