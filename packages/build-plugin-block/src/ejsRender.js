const fse = require('fs-extra');
const ejsRenderDir = require('./ejsRenderDir');

module.exports = async (sourceDir, targetDir, variables, log) => {
  fse.ensureDir(targetDir);
  fse.copySync(sourceDir, targetDir);
  try {
    await ejsRenderDir(targetDir, variables).then();
  } catch (error) {
    log.error('Problems occurred during compilation', error);
  }
};
