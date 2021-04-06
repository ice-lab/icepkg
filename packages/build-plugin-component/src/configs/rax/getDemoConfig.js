const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { hmrClient } = require('rax-compile-config');
const getBaseWebpack = require('./getBaseWebpack');
const setCSSRule = require('../../utils/setCSSRule');
const { getRaxDemoEntryJs } = require('../../utils/handlePaths');
const defaultConfig = require('./web/defaultConfig.js');
const { configHTMLPlugin, configHTMLContent, configWebpack } = require('../../utils/htmlInjection');

module.exports = (context, options) => {
  const { command, rootDir, userConfig } = context;
  const { demos, entries, inlineStyle = true } = options;
  const config = getBaseWebpack(context, { ...options, name: 'demo' });
  const portalPath = getRaxDemoEntryJs(rootDir);

  config.output.filename('[name].js');
  config.output.publicPath('./');
  config.output.path(path.join(rootDir, 'build'));
  setCSSRule(config, inlineStyle);

  // set default content of html
  configHTMLContent(defaultConfig);

  // config htmlInjection for once
  if (userConfig.htmlInjection) {
    configWebpack(userConfig.htmlInjection);
  }

  if (command === 'start') {
    config.output.publicPath('/demo');
  } else {
    const entrieKeys = Object.keys(entries);

    entrieKeys.forEach((entryKey) => {
      config
        .entry(`demo/${entryKey}`)
        .add(entries[entryKey]);

      // config.plugin(`html4${entryKey}`).use(HtmlWebpackPlugin, [
      config.plugin(entrieKeys.length > 1 ? `HtmlWebpackPlugin_demo/${entryKey}` : `HtmlWebpackPlugin`).use(HtmlWebpackPlugin, [
        {
          inject: true,
          filename: `demo/${entryKey}.html`,
          chunks: [entryKey],
          jsPath: `./${entryKey}.js`,
          cssPath: `./${entryKey}.css`,
          inlineStyle,
          template: path.resolve(__dirname, '../../template/raxDemo.html'),
        },
      ]);
    });

    // custom html config
    configHTMLPlugin(config);

    /**
     * 后移的原因是entries数量会受portal的影响
     * 导致htmlInjection插件名生成与上面不一致
     */
    if (command === 'start') {
      config
        .entry('portal')
        .add(hmrClient)
        .add(portalPath);
    } else {
      config.entry('portal').add(portalPath);
    }
    
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
