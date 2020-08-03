const path = require('path');
const fse = require('fs-extra');
const npmUtils = require('ice-npm-utils');

module.exports = async (pkg, rootDir) => {
  // modify pkg home page
  const { name, version } = pkg;
  const pkgPath = path.resolve(rootDir, 'package.json');

  // 1. 业务组件自身的 pkg.materialConfig
  let unpkgHost = pkg.materialConfig && pkg.materialConfig.unpkgHost;
  if (!unpkgHost) {
    try {
      // 2. 物料集合根目录的 pkg.materialConfig
      const materialPkgData =  await fse.readJSON(path.resolve(rootDir, '../../package.json'));
      unpkgHost = materialPkgData.materialConfig && materialPkgData.materialConfig.unpkgHost;
    } catch(err) {}

    if (!unpkgHost) {
      try {
        // 3. iceworks cli config
        const CONFIG_PATH = path.join(userHome || __dirname, '.iceworks/cli-config.json');
        const configData =  await fse.readJSON(CONFIG_PATH);
        unpkgHost = configData && mconfigData.unpkgHost;
      } catch(err) {}

      if (!unpkgHost) {
        // 4. ice-npm-utils
        unpkgHost = npmUtils.getUnpkgHost(name);
      } 
    }
  }

  const homepage = `${path.join(unpkgHost, name)}@${version}/build/index.html`;
  fse.writeJsonSync(pkgPath, { ...pkg, homepage }, {
    spaces: 2,
  });
};
