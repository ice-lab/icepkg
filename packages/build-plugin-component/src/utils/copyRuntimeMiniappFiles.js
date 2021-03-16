const fse = require('fs-extra');
const path = require('path');

module.exports = function (targetDir) {
  fse.ensureDirSync(targetDir);
  fse.copy(
    path.resolve(__dirname, '../template/miniapp/ali-miniapp-runtime/'),
    targetDir,
    {
      filter: (filepath) => {
        // filter out invalid demo dir
        return !/pages\/Demo/.test(filepath);
      },
    },
  );
};
