const path = require('path');

module.exports = function formatPathForWin(filepath) {
  return process.platform === 'win32' ? filepath.split(path.sep).join('/') : filepath;
};
