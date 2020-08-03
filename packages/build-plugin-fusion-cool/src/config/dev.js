const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const generateEntry = require('../utils/generateEntry');
const formatPathForWin = require('../utils/formatPathForWin');
const { getPkgJSONSync } = require('../utils/pkgJson');


module.exports = (config, { rootDir, hasIndexScss }) => {
  config.plugin('HtmlWebpackPlugin')
    .use(HtmlWebpackPlugin, [{
      template: require.resolve('../template/adaptor.html'),
      filename: 'adaptor/index.html',
    }]);

  const pkg = getPkgJSONSync(rootDir) || {};
  const adaptorNamePkg = pkg.componentConfig && pkg.componentConfig.name;

  const adaptorEntry = generateEntry({
    template: 'adaptor.js.hbs',
    filename: 'adaptor-index.js',
    rootDir,
    params: {
      adaptorNamePkg,
      adaptor: formatPathForWin(path.resolve(rootDir, 'adaptor/index.js')),
      adaptorGenerate: formatPathForWin(path.resolve(rootDir, 'node_modules/@alifd/adaptor-generate')),
      style: formatPathForWin(path.resolve(rootDir, `src/${hasIndexScss ? 'index' : 'main'}.scss`)),
    },
  });
  config.entryPoints.clear();
  config.merge({
    entry: { adaptor: adaptorEntry },
  });
};
