const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const setSassStyleExpanded = require('./setSassStyleExpanded');

module.exports = (config, useStylesheetLoader) => {
  if (useStylesheetLoader) {
    config.module.rule('css')
      .test(/\.css?$/)
      .use('stylesheet-loader')
      .loader(require.resolve('stylesheet-loader'));

    config.module.rule('less')
      .test(/\.less?$/)
      .use('stylesheet-loader')
      .loader(require.resolve('stylesheet-loader'))
      .end()
      .use('less')
      .loader(require.resolve('less-loader'));

    config.module.rule('scss')
      .test(/\.scss?$/)
      .use('stylesheet-loader')
      .loader(require.resolve('stylesheet-loader'))
      .end()
      .use('sass-loader')
      .loader(require.resolve('sass-loader'));
  } else {
    const cssLoaderOptions = {
      modules: {
        auto: /\.module\.\w+$/i,
        localIdentName: '[path][name]__[local]--[hash:base64:5]',
      },
    };

    const postcssOptions = {
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
    };
    config.module.rule('css')
      .test(/\.css?$/)
      .use('MiniCssExtractPlugin.loader')
      .loader(MiniCssExtractPlugin.loader)
      .options({
        esModule: false,
      })
      .end()
      .use('css')
      .loader(require.resolve('css-loader'))
      .options(cssLoaderOptions)
      .end()
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options(postcssOptions);

    config.module.rule('less')
      .test(/\.less?$/)
      .use('MiniCssExtractPlugin.loader')
      .loader(MiniCssExtractPlugin.loader)
      .options({
        esModule: false,
      })
      .end()
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options(cssLoaderOptions)
      .end()
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options(postcssOptions)
      .end()
      .use('less-loader')
      .loader(require.resolve('less-loader'));

    config.module.rule('scss')
      .test(/\.scss?$/)
      .use('MiniCssExtractPlugin.loader')
      .loader(MiniCssExtractPlugin.loader)
      .options({
        esModule: false,
      })
      .end()
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options(cssLoaderOptions)
      .end()
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options(postcssOptions)
      .end()
      .use('sass-loader')
      .loader(require.resolve('sass-loader'));
  }

  setSassStyleExpanded(config);
};
