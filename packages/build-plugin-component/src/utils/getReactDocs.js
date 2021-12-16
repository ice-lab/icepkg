/**
 * get React docs from glob patterns
 */
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const camelcase = require('camelcase');
const reactDocgen = require('react-docgen');
const formatPathForWin = require('./formatPathForWin');
const glob = require('fast-glob');

module.exports = function getReactDocs(rootPath, patterns = ['src/**/*.{js,jsx,ts,tsx}']) {
  if (!existsSync(rootPath)) {
    return [];
  }

  const paths = glob.sync(patterns, { base: rootPath });

  return paths
    .map((filename) => {
      const filePath = formatPathForWin(join(rootPath, filename));
      const content = readFileSync(filePath, 'utf-8');

      try {
        const reactDoc = reactDocgen.parse(content, null, null, {
          filename: filePath,
        });

        filename = filename.replace(/\.[tj]sx?$/, '');
        const href = `/?demo=${filename}`;

        return {
          href,
          filename,
          pascalCaseName: camelcase(filename, { pascalCase: true }),
          filePath,
          reactDoc,
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
};
