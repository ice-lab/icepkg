const path = require('path');
const setAssetsPath = require('../../utils/setAssetsPath');

module.exports = (config, { rootDir }) => {
  setAssetsPath(config);
  const outputPath = path.resolve(rootDir, 'build');
  config.output.path(outputPath);
};
