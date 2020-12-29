const path = require('path');

function getRaxDemoEntryJs(rootDir) {
  return path.join(rootDir, 'node_modules', 'rax-demoentry.js');
}

module.exports = {
  getRaxDemoEntryJs,
};
