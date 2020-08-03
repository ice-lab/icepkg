/**
 * get the index file ext name for the right entry file
 *
 * @param {*} cwd current dir
 * @returns
 */
const path = require('path');
const glob = require('glob');
const {
  REG_JS_INDEX,
  REG_SASS_INDEX,
  REG_LESS_INDEX,
} = require('../configs/reg');

module.exports = cwd => {
  const rootFilePaths = glob.sync('*', {
    cwd,
  });
  const extNames = {};
  rootFilePaths.forEach(i => {
    if (REG_JS_INDEX.test(i) && !extNames.jsExt) {
      extNames.jsExt = path.extname(i);
    }
    if (!extNames.styleExt) {
      if (REG_SASS_INDEX.test(i)) {
        extNames.styleExt = path.extname(i);
        extNames.isSassLike = true;
      } else if (REG_LESS_INDEX.test(i)) {
        extNames.styleExt = path.extname(i);
        extNames.isLessLike = true;
      }
    }
  });

  return Object.keys(extNames).length && extNames;
};
