const fse = require('fs-extra');
const resolveImports = require('./resolveImports');

const genDemoPages = ({ filepath, code, demoFilepath, pageFilename, pageFileCode }) => {
  const resolvedCode = resolveImports(code, filepath);
  fse.writeFileSync(demoFilepath, resolvedCode, 'utf-8');
  fse.writeFileSync(pageFilename, pageFileCode, 'utf-8');
};

module.exports = genDemoPages;
