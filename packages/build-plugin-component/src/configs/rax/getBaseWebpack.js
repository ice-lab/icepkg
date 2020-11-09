const path = require('path');
const Chain = require('webpack-chain');
const { setBabelAlias } = require('rax-compile-config');
const getBabelConfig = require('rax-babel-config');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (context, options) => {
  const { rootDir, command, pkg, webpack } = context;
  const { isES6, target } = options || {};
  const config = new Chain();

  const babelConfig = getBabelConfig({
    styleSheet: true,
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
      // Built-in modules in QuickApp
      if (request.indexOf('@system') !== -1) {
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
    config.resolve.alias.set(pkg.name, path.resolve(rootDir, 'src/index'));
  }

  return config;
};
