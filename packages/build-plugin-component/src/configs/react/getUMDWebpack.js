const path = require('path');
const _ = require('lodash');
const getDistWebpack = require('./getDistWebpack');
// const { getWebpackConfig } = require('build-scripts-config');

module.exports = ({ context, compileOptions, extNames, hasMain }) => {
  const config = getDistWebpack({
    context,
    compileOptions,
    extNames,
    hasMain,
  });

  const {
    library,
    libraryTarget = 'umd',
    libraryExport,
  } = compileOptions;

  const { pkg, rootDir } = context;
  const pkgName = _.camelCase(pkg.name || '');

  const entryName = compileOptions.filename || library;
  const { jsExt } = extNames;
  const jsPath = path.resolve(rootDir, `src/index${jsExt}`);

  // remove all entry points
  config.entryPoints.clear();

  config.entry(entryName).add(jsPath);

  config.output
    .filename('[name].js')
    .library(library || pkgName)
    .libraryTarget(libraryTarget);

  if (libraryExport) {
    config.output.libraryExport(libraryExport);
  }

  return config;
};
