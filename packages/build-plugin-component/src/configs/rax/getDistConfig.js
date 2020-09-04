const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getBaseWebpack = require('./getBaseWebpack');

module.exports = (context, options) => {
  const config = getBaseWebpack(context, options);
  const { rootDir, taskName } = context;
  const { entryName = 'index' } = options;

  config.entry(entryName)
    .add(path.resolve(rootDir, 'src/index'));

  config.externals([
    function(ctx, request, callback) {
      if (request.indexOf('@weex-module') !== -1) {
        return callback(null, `commonjs ${request}`);
      }
      // Built-in modules in QuickApp
      if (request.indexOf('@system') !== -1) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
    nodeExternals(),
  ]);
  // 输出到 dist 目录
  config.output.path(path.join(rootDir, 'dist'));

  if (options.forceInline) {
    config.module.rule('css')
      .test(/\.css?$/)
      .use('css')
      .loader(require.resolve('stylesheet-loader'))
      .options({ taskName });

    config.module.rule('less')
      .test(/\.less?$/)
      .use('css')
      .loader(require.resolve('stylesheet-loader'))
      .options({ taskName })
      .end()
      .use('less')
      .loader(require.resolve('less-loader'));
  } else {
    config.module.rule('css')
      .test(/\.css?$/)
      .use('minicss')
      .loader(MiniCssExtractPlugin.loader)
      .end()
      .use('css')
      .loader(require.resolve('css-loader'))
      .end()
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options({
        ident: 'postcss',
        plugins: () => [
          // eslint-disable-next-line global-require
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // eslint-disable-next-line global-require
          require('postcss-plugin-rpx2vw')(),
        ],
      });

    config.module.rule('less')
      .test(/\.less?$/)
      .use('minicss')
      .loader(MiniCssExtractPlugin.loader)
      .end()
      .use('css')
      .loader(require.resolve('css-loader'))
      .end()
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options({
        ident: 'postcss',
        plugins: () => [
          // eslint-disable-next-line global-require
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // eslint-disable-next-line global-require
          require('postcss-plugin-rpx2vw')(),
        ],
      })
      .end()
      .use('less')
      .loader(require.resolve('less-loader'));
  }

  config.plugin('minicss')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].css',
    }]);

  return config;
};
