const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (config, { pkg, rootDir, entry }) => {
  config.target('web');
  config.context(rootDir);

  // modify entry
  config.entryPoints.clear();
  config.merge({ entry });

  const entryKeys = Object.keys(entry);
  entryKeys.forEach((entryKey) => {
    config.plugin(`HtmlWebpackPlugin_${entryKey}`).use(HtmlWebpackPlugin, [
      {
        template: require.resolve('../../template/demo.hbs'),
        excludeChunks: entryKeys.filter((n) => n !== entryKey),
        filename: entryKeys.length === 1 ? 'index.html' : `${entryKey}_demo.html`,
      },
    ]);
  });

  if (entryKeys.length > 1) {
    config.plugin('HtmlWebpackPlugin').use(HtmlWebpackPlugin, [
      {
        template: require.resolve('../../template/reactDemo.html'),
        templateParameters: {
          entries: entryKeys.map((key) => ({
            entryName: key,
            entryPath: `${key}_demo.html`,
          })),
        },
        inject: false,
        filename: 'index.html',
      },
    ])
  }
  
  config.resolve.modules
    .add('node_modules')
    .add(path.join(rootDir, 'node_modules'))
    .add(path.resolve(__dirname, '../../node_modules'));

  const fileList = entryKeys.map((key) => entry[key]);
  ['jsx', 'tsx'].forEach(rule => {
    config.module
      .rule(rule)
      .exclude.clear()
      .add(/node_modules(?!(.+_component_demo|.+build-plugin-component))/)
      .end()
      .use('babel-loader')
      .tap((options) => {
        const { plugins = [] } = options;
        return {
          ...options,
          plugins: [
            ...plugins,
            // only transform index entry
            [require.resolve('../../utils/babelPluginCorejsLock.js'), { fileList }],
          ],
        };
      });
  });
  // disable vendor
  config.optimization.splitChunks({ cacheGroups: {} });
  // remove CopyWebpackPlugin (component compile do not have public folder)
  config.plugins.delete('CopyWebpackPlugin');
  // add demo loader
  config.module
    .rule('demo-loader')
    .test(/\.md$/i)
    .use('demo')
    .loader(require.resolve('../../webpackLoader/reactDemoLoader'));
  // add packagename to webpack alias
  ['.js', '.jsx', '.json', '.html', '.ts', '.tsx'].forEach(extension => {
    config.resolve.extensions.add(extension);
  });
  config.resolve.alias.set(pkg.name, path.resolve(rootDir, 'src/index'));

  config.module.rule('jsx').test(/\.jsx?$|\.md$/); // Issue: https://github.com/webpack/webpack/issues/4411
  config.output.filename('[name].js');
};
