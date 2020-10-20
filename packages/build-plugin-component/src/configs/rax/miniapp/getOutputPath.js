const { resolve } = require('path');
const { MINIAPP } = require('../../../constants');

module.exports = (context, { target = MINIAPP, distDir = '' }) => {
  const { rootDir, command, userConfig } = context;
  if (distDir) {
    return resolve(rootDir, distDir);
  }

  const { outputDir = 'lib' } = userConfig;

  if (command === 'build') {
    return resolve(rootDir, outputDir, target);
  } else {
    return resolve(rootDir, 'build', target === MINIAPP ? 'ali-miniapp' : target, 'components', 'Target');
  }
};
