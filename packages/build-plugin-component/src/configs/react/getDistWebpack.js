const path = require('path');
const { getWebpackConfig } = require('build-scripts-config');

module.exports = ({ context, compileOptions, extNames, hasMain }) => {
  const mode = 'production';
  const config = getWebpackConfig(mode);
  const { rootDir } = context;
  const {
    // dist minify
    minify,
    // dist sourceMap
    sourceMap,

    // entryName
    entryName = 'index',

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
  } = compileOptions;
  const { jsExt, styleExt } = extNames;
  // file name
  const jsPath = path.resolve(rootDir, `src/index${jsExt}`);

  config.context(rootDir);

  // - set entry
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
    .publicPath('./dist/');

  // - set externals
  if (externals) {
    config.externals(externals);
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
