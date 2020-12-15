const path = require('path');
const { ensureDirSync } = require('fs-extra');
const generateEntry = require('./generateEntry');
const { NODE } = require('../constants');

function generate({ demos, rootDir, template, placeholder }) {
  const store = {};

  demos.forEach((demo) => {
    const { filename } = demo;
    const entryPath = path.join(rootDir, 'build', placeholder.replace('placeholder', filename));

    // make sure build dir is exists
    ensureDirSync(path.join(rootDir, 'build'));

    store[filename] = entryPath;
    generateEntry({
      template: `${template}.hbs`,
      outputPath: entryPath,
      params: {
        demos: [demo],
      },
    });
  });

  return store;
}

function generateRaxEntry(demos, rootDir, targets) {
  // generate demo entry
  // const entries = {};
  const entries = generate({
    demos,
    rootDir,
    template: 'raxTemplate',
    placeholder: 'rax-demo-placeholder.js',
  });

  let serverBundles = {};

  if (targets.includes(NODE)) {
    // generate ssr server bundle
    serverBundles = generate({
      demos,
      rootDir,
      template: 'raxSSRTemplate',
      placeholder: 'rax-demo-placeholder.server.js',
    });
  }

  let herboxEntries = {};
  if (targets.includes('miniapp')) {
    // generate herbox entries if miniapp is included
    herboxEntries = generate({
      demos,
      rootDir,
      template: 'raxHerboxTemplate',
      placeholder: 'rax-herbox-placeholder.tsx',
    });
  }

  return { entries, serverBundles, herboxEntries };
}

module.exports = generateRaxEntry;
