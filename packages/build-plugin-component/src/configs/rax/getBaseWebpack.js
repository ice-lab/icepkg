const path = require('path');
const Chain = require('webpack-chain');
const { setBabelAlias } = require('rax-compile-config');
const getBabelConfig = require('rax-babel-config');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ProgressPlugin = require('webpackbar');
const TimeFixPlugin = require('time-fix-plugin');
const setDefine = require('../../useConfig/define');

module.exports = (context, options) => {
  const { rootDir, command, pkg, webpack, userConfig: { define } } = context;
  const { isES6, target, name, inlineStyle = true, https } = options || {};
  const config = new Chain();

  const babelConfig = getBabelConfig({
    styleSheet: inlineStyle,
    isES6,
    custom: {
      ignore: ['**/**/*.d.ts'],
    },
  });

  setBabelAlias(config);

  config.target('web');
  config.context(rootDir);
  config.output.publicPath('/');

  config.externals([
    function (ctx, request, callback) {
      if (request.indexOf('@weex-module') !== -1) {
        return callback(null, `commonjs ${request}`);
      }
      // compatible with @system for quickapp
      if (request.indexOf('@system') !== -1) {
        return callback(null, `commonjs ${request}`);
      }
      // compatible with miniapp plugin
      if (/^plugin:\/\//.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
  ]);

  config.resolve.extensions.merge(['.js', '.json', '.jsx', '.ts', '.tsx', '.html']);

  config.module
    .rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelConfig);

  config.module
    .rule('tsx')
    .test(/\.tsx?$/)
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelConfig)
    .end()
    .use('ts')
    .loader(require.resolve('ts-loader'));

  if (options.enablePlatformLoader && target) {
    ['jsx', 'tsx'].forEach((rule) => {
      config.module.rule(rule)
        .use('platform')
        .loader(require.resolve('rax-compile-config/src/platformLoader'))
        .options({ platform: target });
    });
  }

  config.module
    .rule('md')
    .test(/\.md$/)
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelConfig)
    .end()
    .use('markdown-loader')
    .loader(require.resolve('../../webpackLoader/raxDemoLoader'));

  config.module
    .rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
    .loader(require.resolve('image-source-loader'));

  config.plugin('caseSensitivePaths').use(CaseSensitivePathsPlugin);

  config.plugin('noError').use(webpack.NoEmitOnErrorsPlugin);

  // minify
  if (!options.minify) {
    // disable minify code
    config.optimization.minimize(options.minify);
  }

  if (command === 'start') {
    config.mode('development');
    config.devtool('inline-module-source-map');

    config.devServer.https(Boolean(https));
  } else if (command === 'build') {
    config.mode('production');
    // support production sourcemap
    if (options.sourceMap) {
      config.devtool(typeof options.sourceMap === 'string' ? options.sourceMap : 'source-map');
    }
    config.optimization
      .minimizer('terser')
      .use(TerserPlugin, [
        {
          terserOptions: {
            output: {
              ascii_only: true,
              comments: false,
            },
          },
          extractComments: false,
          sourceMap: !!options.sourceMap,
        },
      ])
      .end()
      .minimizer('optimizeCSS')
      .use(OptimizeCSSAssetsPlugin);
  }

  if (pkg.name) {
    config.resolve.alias.set(`${pkg.name}$`, path.resolve(rootDir, 'src/index'));
  }
  config
    .plugin('ProgressPlugin')
    .use(ProgressPlugin, [
      {
        color: '#F4AF3D',
        name: name || target || 'webpack',
      },
    ]);
  // fix: https://github.com/webpack/watchpack/issues/25
  config.plugin('TimeFixPlugin').use(TimeFixPlugin);


  if (define) {
    setDefine(config, define, context);
  }

  return config;
};
