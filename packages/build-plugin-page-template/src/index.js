const path = require('path');
const glob = require('glob');
const { getWebpackConfig, getJestConfig } = require('build-scripts-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const formatPath = (outputPath) => {
  const isWin = process.platform === 'win32';
  // js\index.js => js/index.js
  return isWin ? outputPath.replace(/\\/g, '/') : outputPath;
};

module.exports = ({ context, log, registerTask,registerUserConfig,onGetWebpackConfig,onGetJestConfig }) => {
  const { rootDir, command, pkg } = context;
  const mode = command === 'start' ? 'development' : 'production';
  const defaultConfig = getWebpackConfig(mode);
  registerTask('page',defaultConfig);

  const defaultFilename = '[name].js';
  // register config outputAssetsPath for compatiable with plugin-fusion-material
  registerUserConfig({
    name: 'outputAssetsPath',
    validation: 'object',
    defaultValue: { js: '', css: '' },
    configWebpack: (config, outputAssetsPath) => {
      config.output.filename(formatPath(path.join(outputAssetsPath.js || '', defaultFilename)));
      if (config.plugins.get('MiniCssExtractPlugin')) {
        const options = config.plugin('MiniCssExtractPlugin').get('args')[0];
        config.plugin('MiniCssExtractPlugin').tap((args) => [Object.assign(...args, {
          filename: formatPath(path.join(outputAssetsPath.css || '', options.filename)),
        })]);
      }
    },
  });
  onGetWebpackConfig((config) => {
    // modify HtmlWebpackPlugin
    config.plugin('HtmlWebpackPlugin').use(HtmlWebpackPlugin, [{
      inject: true,
      template: require.resolve('./template/index.html'),
      minify: false,
      templateParameters: {
        demoTitle: pkg.blockConfig && pkg.blockConfig.name || 'ICE PAGE TEMPLATE',
      },
    }]);
    config.output.filename(defaultFilename);
    const outputPath = path.resolve(rootDir, 'build');
    config.output.path(outputPath);
    // add custom entry file
    config.merge({
      entry: {
        index: [require.resolve('./template/block.entry.js')],
      },
    });

    // default devServer config
    config.merge({
      devServer: {
        disableHostCheck: true,
        compress: true,
        clientLogLevel: 'none',
        hot: true,
        publicPath: '/',
        quiet: true,
        watchOptions: {
          ignored: /node_modules/,
          aggregateTimeout: 600,
        },
        before(app) {
          app.use((req, res, next) => {
            // set cros for all served files
            res.set('Access-Control-Allow-Origin', '*');
            next();
          });
        },
      },
    });

    // update publicPath ./
    config.output.publicPath('./');
    ['scss', 'scss-module', 'css', 'css-module', 'less', 'less-module'].forEach((rule) => {
      if (config.module.rules.get(rule)) {
        config.module.rule(rule).use('MiniCssExtractPlugin.loader').tap(() => ({ publicPath: '../' }));
      }
    });

    config.resolve.modules.add('node_modules');
    config.resolve.modules.add(path.join(rootDir, 'node_modules'));
    // check demo file
    const demoFiles = glob.sync('{demo/index.{js,jsx,ts,tsx},demo.{js,jsx,ts,tsx}}', {
      cwd: rootDir,
    });
    const hasDemoFile = demoFiles.length > 0;
    // add alias for load Block component
    config.merge({
      resolve: {
        alias: {
          '@/page': path.join(rootDir, hasDemoFile ? 'demo' : 'src/index'),
        },
      },
    });

    // add exclude rule for compile template/ice.block.entry.js
    ['jsx', 'tsx'].forEach((rule) => {
      config.module
        .rule(rule)
        .exclude
        .clear()
        .add(/node_modules(?!.+block.entry.js)/);
    });
  });
  if (command === 'test') {
    // jest config
    onGetJestConfig((jestConfig) => {
      const { moduleNameMapper, ...rest } = jestConfig;
      const defaultJestConfig = getJestConfig({ rootDir, moduleNameMapper });
      return {
        ...defaultJestConfig,
        ...rest,
        // defaultJestConfig.moduleNameMapper already combine jestConfig.moduleNameMapper
        moduleNameMapper: defaultJestConfig.moduleNameMapper,
      };
    });
  }

};
