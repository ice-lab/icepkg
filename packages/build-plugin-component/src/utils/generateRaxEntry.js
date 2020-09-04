const path = require('path');
const getDemoDir = require('./getDemoDir');
const getDemos = require('./getDemos');
const { markdownParser } = require('./markdownHelper');
const generateEntry = require('./generateEntry');
const { NODE } = require('../constants');

function generateRaxEntry(rootDir, targets) {
  const demoDir = getDemoDir(rootDir);
  const demos = getDemos(path.join(rootDir, demoDir), markdownParser);

  // generate demo entry
  const entries = {};
  const serverBundles = {};
  demos.forEach((demo) => {
    const { filename } = demo;
    const entryPath = path.join(rootDir, 'node_modules', `rax-demo-${filename}.js`);
    entries[filename] = entryPath;
    generateEntry({
      template: 'raxTemplate.hbs',
      outputPath: entryPath,
      params: {
        demos: [demo],
      },
    });
  });

  if (targets.includes(NODE)) {
    // generate ssr server bundle
    demos.forEach((demo) => {
      const { filename } = demo;
      const entryPath = path.join(rootDir, 'node_modules', `rax-demo-${filename}.server.js`);
      serverBundles[filename] = entryPath;
      generateEntry({
        template: 'raxSSRTemplate.hbs',
        outputPath: entryPath,
        params: {
          demos: [demo],
        },
      });
    });
  }

  return { entries, serverBundles };
}

module.exports = generateRaxEntry;