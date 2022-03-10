/**
 * get React docs from glob patterns
 */
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const reactDocgenTs = require('react-docgen-typescript');
const reactDocgen = require('react-docgen');
const formatPathForWin = require('./formatPathForWin');
const glob = require('fast-glob');

module.exports = function getReactDocs(rootPath, patterns) {
  if (!patterns || !existsSync(rootPath)) {
    return [];
  }

  const paths = glob.sync(patterns, { base: rootPath });

  let reactDocs = [];

  paths.forEach((filename) => {
    const filePath = formatPathForWin(join(rootPath, filename));
    let reactDoc;

    try {
      if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
        reactDoc = reactDocgenTs.parse(filePath, {
          savePropValueAsString: true,
        });
        reactDocs = reactDocs.concat(reactDoc);
      } else {
        const content = readFileSync(filePath, 'utf-8');
        reactDoc = reactDocgen.parse(content, null, null, {
          filename: filePath,
        });
        reactDocs.push({ filePath, ...reactDoc });
      }
    } catch (e) {
      return null;
    }
  });
  return reactDocs;
};
