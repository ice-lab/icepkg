const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { hmrClient } = require('rax-compile-config');
const getBaseWebpack = require('./getBaseWebpack');
const generateRaxDemo = require('../../utils/generateRaxDemo');

module.exports = (context, options) => {
  const { command, rootDir } = context;
  const { demos, entries } = options;
  const config = getBaseWebpack(context, options);
  const portalPath = generateRaxDemo(demos, context);
  if (command === 'start') {
    config
      .entry('portal')
      .add(hmrClient)
      .add(portalPath);
  } else {
    config.entry('portal').add(portalPath);
  }

  config.output.filename('[name].js');
  config.output.publicPath('./');
  config.output.path(path.join(rootDir, 'build'));
  if (command === 'start') {
    config.module
      .rule('css')
      .test(/\.css?$/)
      .use('style')
      .loader(require.resolve('style-loader'))
      .end()
      .use('css')
      .loader(require.resolve('css-loader'))
      .end()
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options({
        ident: 'postcss',
        plugins: () => [
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          require('postcss-plugin-rpx2vw')(),
        ],
      });

    config.module
      .rule('less')
      .test(/\.less?$/)
      .use('style')
      .loader(require.resolve('style-loader'))
      .end()
      .use('css')
      .loader(require.resolve('css-loader'))
      .end()
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options({
        ident: 'postcss',
        plugins: () => [
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          require('postcss-plugin-rpx2vw')(),
        ],
      })
      .end()
      .use('less')
      .loader(require.resolve('less-loader'));

  } else {
    Object.keys(entries).forEach((entryKey) => {
      config
        .entry(`demo/${entryKey}`)
        .add(entries[entryKey]);
  
      config.plugin(`html4${entryKey}`).use(HtmlWebpackPlugin, [
        {
          inject: true,
          filename: `demo/${entryKey}.html`,
          chunks: [entryKey],
          jsPath: `./${entryKey}.js`,
          template: path.resolve(__dirname, '../../template/raxDemo.html'),
        },
      ]);
    });
    config.module
      .rule('css')
      .test(/\.css?$/)
      .use('css')
      .loader(require.resolve('stylesheet-loader'));
  
    config.module
      .rule('less')
      .test(/\.less?$/)
      .use('css')
      .loader(require.resolve('stylesheet-loader'))
      .end()
      .use('less')
      .loader(require.resolve('less-loader'));
  
    config.plugin('minicss').use(MiniCssExtractPlugin, [
      {
        filename: '[name].css',
      },
    ]);
  }

  config.plugin('html').use(HtmlWebpackPlugin, [
    {
      inject: true,
      filename: command === 'start' ? 'portal' : 'index.html',
      chunks: ['portal'],
      template: path.resolve(__dirname, '../../template/raxPortal.html'),
    },
  ]);

  return config;
};
