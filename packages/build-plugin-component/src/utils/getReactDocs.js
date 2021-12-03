/**
 * get demos from demo dir
 */
const { readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const camelcase = require('camelcase');
const reactDocgen = require('react-docgen');
const formatPathForWin = require('./formatPathForWin');

module.exports = function getReactDocs(srcPath) {
  if (!existsSync(srcPath)) {
    return [];
  }

  return readdirSync(srcPath)
    .filter((file) => /.*\.[tj]sx?$/.test(file))
    .map((filename) => {
      const filePath = formatPathForWin(join(srcPath, filename));
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
