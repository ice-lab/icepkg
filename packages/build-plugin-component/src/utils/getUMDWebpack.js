const path = require('path');
const { upperFirst, camelCase } = require('lodash');
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
    basicComponents = ['@alifd/next'],
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

  // - set externals
  if (externals) {
    const localExternals = [].concat(externals);

    /**
     * see [rfc](https://github.com/ice-lab/iceworks-cli/issues/153)
     * plugin-fusion is not required in Rax Component project
    */
    const validBasicComponent = basicComponents
      .filter((externalKey) => Object.keys(externals).includes(externalKey));

    if (validBasicComponent.length) {
      const regexs = validBasicComponent.map((name) => ({
        name,
        regex: new RegExp(`${name.replace('/', '\\/') }\\/(es|lib)\\/([-\\w+]+)$`),
      }));

      localExternals.push((_context, request, callback) => {
        for (let i = 0; i < regexs.length; i++) {
          const { name, regex } = regexs[i];
          if (regex.test(request)) {
            const componentName = request.match(regex)[2];
            const externalKey = typeof externals[name] === 'string' ? externals[name] : externals[name].root;

            if (componentName) {
              return callback(null, [externalKey, upperFirst(camelCase(componentName))], 'global');
            }
          } else if (regex.test(_context) && /\.(scss|less|css)$/.test(request)) {
            const externalKey = typeof externals[name] === 'string' ? externals[name] : externals[name].root;
            return callback(null, externalKey);
          }
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
