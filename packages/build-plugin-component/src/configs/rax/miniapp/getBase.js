const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const { setComponentConfig } = require('miniapp-compile-config');
const getWebpackBase = require('../getBaseWebpack');
const getOutputPath = require('./getOutputPath');
const { MINIAPP } = require('../../../constants');

const parseTarget = (target) => (target === MINIAPP ? 'ali-miniapp' : target);

const suffixMap = {
  miniapp: 'ali',
  'wechat-miniprogram': 'wechat',
};

const genEntry = (rootDir, target) => {
  const srcDir = path.join(rootDir, 'src');
  const files = glob.sync(`index.${suffixMap[target]}.?(ts|tsx|js|jsx)`, { cwd: srcDir });
  if (files.length) {
    return `./src/index.${suffixMap[target]}`;
  }
  return './src/index';
};


module.exports = (context, target, options = {}, onGetWebpackConfig) => {
  const { rootDir, command } = context;
  const { distDir = '' } = options[target] || {};

  const outputPath = getOutputPath(context, { target, distDir });
  const config = getWebpackBase(context, {
    disableRegenerator: true,
    name: 'miniapp',
  });
  let entryPath = genEntry(rootDir, target);

  console.log('entryPath', entryPath);
  if (command === 'start') {
    const miniappDemoFolder = 'miniapp-demo';
    const filesPath = glob.sync('index.*', { cwd: path.join(rootDir, miniappDemoFolder) });
    filesPath.forEach((filePath) => {
      entryPath = `./${miniappDemoFolder}/${filePath}`;
    });
  }
  // copy template file to build
  const miniappOutput = path.join(rootDir, 'build', parseTarget(target));
  fse.ensureDirSync(miniappOutput);
  fse.copySync(path.join(__dirname, `../../../template/miniapp/${parseTarget(target)}`), miniappOutput);

  onGetWebpackConfig(`component-build-${target}`, (chainConfig) => {
    setComponentConfig(chainConfig, options[target], {
      context,
      entryPath,
      outputPath,
      target,
    });
  });

  return config;
};
