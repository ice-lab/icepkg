const path = require('path');
const { upperFirst, camelCase } = require('lodash');
const { getWebpackConfig } = require('build-scripts-config');

const nextRegex = /@(alife|alifd)\/next\/(es|lib)\/([-\w+]+)$/;
const baseRegex = /@icedesign\/base\/lib\/([-\w+]+)$/;

module.exports = ({ context, compileOptions, extNames, hasMain }) => {
  const mode = 'production';
  const config = getWebpackConfig(mode);
  const { rootDir } = context;
  const {
    // dist minify
    minify,
    // dist sourceMap
    sourceMap,
    // library name
    library,
    // library target
    libraryTarget = 'umd',
    // library export, default is undefined
    libraryExport,
    // externals dependencies
    externals = {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
      },
      '@alifd/next': {
        root: 'Next',
        commonjs: '@alifd/next',
        commonjs2: '@alifd/next',
        amd: '@alifd/next',
      },
      moment: {
        root: 'moment',
        commonjs: 'moment',
        commonjs2: 'moment',
        amd: 'moment',
      },
    },
    basicComponents = [],
  } = compileOptions;
  const { jsExt, styleExt } = extNames;
  // file name
  const filename = compileOptions.filename || library;
  const jsPath = path.resolve(rootDir, `src/index${jsExt}`);

  config.context(rootDir);

  // - set entry
  const entryName = filename;
  if (hasMain || styleExt) {
    const cssPath = path.resolve(
      rootDir,
      hasMain ? 'src/main.scss' : `src/index${styleExt}`,
    );
    config.entry(entryName).add(cssPath);
  }
  config.entry(entryName).add(jsPath);

  // - output library files
  config.output
    .path(path.resolve(rootDir, 'dist'))
    .filename('[name].js')
    .publicPath('./dist/')
    .library(library)
    .libraryExport(libraryExport)
    .libraryTarget(libraryTarget);

  const externalsNext = Object.keys(externals).includes('@alifd/next');
  const externalsNextOfLib = basicComponents.includes('@alifd/next');
  // - set externals
  if (externals) {
    const localExternals = externals;

    if (externalsNext && externalsNextOfLib) {
      localExternals.push((_context, request, callback) => {
        const isNext = nextRegex.test(request);
        const isDesignBase = baseRegex.test(request);
        if (isNext || isDesignBase) {
          const componentName = isNext ? request.match(nextRegex)[3] : request.match(baseRegex)[1];
          const externalKey = isNext ? 'Next' : 'ICEDesignBase';
          if (componentName) {
            return callback(null, [externalKey, upperFirst(camelCase(componentName))]);
          }
        } else if (nextRegex.test(_context) && /\.(scss|css)$/.test(request)) {
          // external style files imported by next style.js
          return callback(null, 'Next');
        }
        return callback();
      });
    }

    // set externals
    config.externals(localExternals);
  }

  // sourceMap
  if (sourceMap) {
    config.devtool(typeof sourceMap === 'string' ? sourceMap : 'source-map');
    config.optimization
      .minimizer('TerserPlugin')
      .tap(([options]) => [
        { ...options, sourceMap: true },
      ]);
  }
  // minify
  if (!minify) {
    // disable minify code
    config.optimization.minimize(minify);
  }

  return config;
};
