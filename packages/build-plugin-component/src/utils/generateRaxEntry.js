const path = require('path');
const generateEntry = require('./generateEntry');
const { NODE } = require('../constants');

function generateRaxEntry(demos, rootDir, targets) {
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