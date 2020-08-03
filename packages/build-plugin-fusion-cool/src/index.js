const path = require('path');
const fse = require('fs-extra');
const resolveSassImport = require('resolve-sass-import');
const { getWebpackConfig } = require('build-scripts-config');
const devConfig = require('./config/dev');
const buildConfig = require('./config/build');

module.exports = ({ context, registerTask, onGetWebpackConfig, onHook, log }) => {
  const { rootDir, command } = context;
  // check adaptor folder
  const hasAdaptor = fse.existsSync(path.join(rootDir, 'adaptor'));

  if (hasAdaptor) {
    // registerTask for adaptor folder
    const mode = command === 'start' ? 'development' : 'production';
    const hasIndexScss = fse.existsSync(path.join(rootDir, 'src', 'index.scss'));
    registerTask('adaptor', getWebpackConfig(mode));

    onGetWebpackConfig('adaptor', (config) => {
      // common config
      config.mode(mode).context(rootDir);
      config.module.rule('hbs-rule').test(/\.hbs$/i).use('hbs').loader(require.resolve('handlebars-loader')).options({});
      const params = { rootDir, hasIndexScss };
      if (command === 'start') {
        devConfig(config, params);
      } else if (command === 'build') {
        buildConfig(config, params);
      }
    });
    onHook('after.build.compile', () => {
      const sassContent = resolveSassImport(hasIndexScss ? 'index.scss' : 'main.scss', path.resolve(rootDir, 'src'));
      fse.writeFileSync(path.resolve(rootDir, 'build/index.scss'), sassContent, 'utf-8');
    });

    if (command === 'start') {
      onHook('after.start.compile', ({ url }) => {
        log.info(`Start development of fusion cool at: ${url}adaptor`);
      });
    }
  }
};
