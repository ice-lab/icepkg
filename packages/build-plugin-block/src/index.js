/* eslint-disable import/no-dynamic-require , global-require */
const path = require('path');
const glob = require('glob');
const chokidar = require('chokidar');
const { getWebpackConfig, getJestConfig } = require('build-scripts-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const originEjsRender = require('./ejsRender');

const formatPath = (outputPath) => {
  const isWin = process.platform === 'win32';
  // js\index.js => js/index.js
  return isWin ? outputPath.replace(/\\/g, '/') : outputPath;
};

module.exports = (
  { context, log, registerTask, registerUserConfig, onGetWebpackConfig, onGetJestConfig },
  userConfig
) => {
  const { usingTemplate, materialType } = userConfig || {};
  const { rootDir, command, pkg } = context;
  const mode = command === 'start' ? 'development' : 'production';
  const defaultConfig = getWebpackConfig(mode);

  // ejs 模板通过接下来的步骤渲染至 .tmp 文件夹。
  // 之后我们将 @/block 重定位到 .tmp 文件夹
  // 这样就引入了经过模拟数据渲染的代码。
  const sourceDir = path.join(rootDir, 'src');
  const mockDir = path.join(rootDir, 'config', 'mock.js');
  function ejsRender() {
    let mockData = {};
    try {
      mockData = require(path.join(rootDir, 'config', 'mock'));
    } catch (err) {
      log.warn('cannot get mock data', err);
    }

    const tmpDir = path.join(rootDir, '.tmp');
    originEjsRender(sourceDir, tmpDir, mockData, log);
  }

  if (usingTemplate) {
    ejsRender();
    const watchers = [
      chokidar.watch(sourceDir, {
        ignoreInitial: true,
      }),
      chokidar.watch(mockDir),
    ];
    watchers.forEach((watcher) => {
      watcher.on('change', () => {
        log.info('FILECHANGE');
        ejsRender();
      });

      watcher.on('error', (err) => {
        log.error('fail to watch file', err);
        process.exit();
      });
    });
  }

  registerTask(materialType, defaultConfig);

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
        config.plugin('MiniCssExtractPlugin').tap((args) => [
          Object.assign(...args, {
            filename: formatPath(path.join(outputAssetsPath.css || '', options.filename)),
          }),
        ]);
      }
    },
  });
  onGetWebpackConfig((config) => {
    // modify HtmlWebpackPlugin
    config.plugin('HtmlWebpackPlugin').use(HtmlWebpackPlugin, [
      {
        inject: true,
        template: require.resolve('./template/index.html'),
        minify: false,
        templateParameters: {
          demoTitle:
            (pkg.blockConfig && pkg.blockConfig.name) || `ICE ${materialType.toUpperCase() || 'BLOCK'} TEMPLATE`,
        },
      },
    ]);
    config.output.filename(defaultFilename);
    const outputPath = path.resolve(rootDir, 'build');
    config.output.path(outputPath);
    // add custom entry file
    config.merge({
      entry: {
        index: [require.resolve('./template/block.entry.js')]
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
        config.module
          .rule(rule)
          .use('MiniCssExtractPlugin.loader')
          .tap(() => ({ publicPath: '../' }));
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
          '@/block': usingTemplate?
            path.join(rootDir, hasDemoFile ? 'demo' : '.tmp/index'):
            path.join(rootDir, hasDemoFile ? 'demo' : 'src/index')
        },
      },
    });

    // add exclude rule for compile template/ice.block.entry.js
    ['jsx', 'tsx'].forEach((rule) => {
      config.module
        .rule(rule)
        .exclude.clear()
        .add(new RegExp('node_modules(?!.+block.entry.js)'));
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
