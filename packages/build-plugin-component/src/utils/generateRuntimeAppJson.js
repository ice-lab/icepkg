const fse = require('fs-extra');

const initAppJson = {
  window: {
    defaultTitle: 'Rax Component Preview',
  },
  pages: [],
};

module.exports = function (outputPath, demoNames) {
  initAppJson.pages = demoNames.map((demo) => `pages/${demo}/index`);

  fse.ensureFileSync(outputPath);
  fse.writeJsonSync(outputPath, initAppJson, {
    spaces: '  ',
  });
};
