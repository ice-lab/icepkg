const path = require('path');
const fse = require('fs-extra');
const { setComponentConfig } = require('miniapp-compile-config');
const getWebpackBase = require('../getBaseWebpack');
const generateEntry = require('../../../utils/generateEntry');
const getOutputPath = require('./getOutputPath');
const parseTarget = require('../../../utils/parseTarget');

const HERBOX_TEMP_DIR = 'mini-program-demos';
const genHerboxEntryKey = (entryKey) => `rax-herbox-${entryKey}`;

module.exports = (context, target, options = {}, onGetWebpackConfig, entryKey) => {
  const { rootDir, pkg } = context;
  const { distDir = '' } = options[target] || {};

  const outputPath = getOutputPath(context, { target, distDir, defaultStartDistDir: `${HERBOX_TEMP_DIR}/${genHerboxEntryKey(entryKey)}` });

  const config = getWebpackBase(context, {
    disableRegenerator: true,
    name: 'miniapp',
  });

  const entryPath = `./build/${genHerboxEntryKey(entryKey)}.tsx`;

  // copy template file to build
  const outuptDir = path.join(rootDir, 'build', HERBOX_TEMP_DIR, genHerboxEntryKey(entryKey));
  const srcDir = path.join(__dirname, `../../../template/miniapp/${parseTarget(target)}`);
  fse.ensureDirSync(outuptDir);
  fse.copySync(srcDir, outuptDir);

  generateEntry({
    template: 'raxHerboxDemoEntry.hbs',
    outputPath: path.join(outuptDir, 'pages/index.json'),
    params: {
      entry: genHerboxEntryKey(entryKey),
    },
  });

  onGetWebpackConfig(`component-build-demo-${entryKey}`, (chainConfig) => {
    // set alias
    if (pkg.name) {
      chainConfig.resolve.alias.set(pkg.name, '../src/index');
    }

    setComponentConfig(chainConfig, options[target], {
      context,
      entryPath,
      outputPath,
      target,
    });
  });

  return config;
};
