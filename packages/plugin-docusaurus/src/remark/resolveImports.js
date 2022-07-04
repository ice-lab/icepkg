const path = require('path');

const importRegex = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:"(.*?)")|(?:'(.*?)'))[\s]*?(?:;|$|)/;

const resolveImports = (code, filePath) => {
  let _code = code;
  const matches = (code.replace(/\n$/, '')).match(new RegExp(importRegex, 'g'));

  if (matches) {
    const imports = matches.map((matchStr) => {
      const [, singleQuoteImporter, doubleQuoteImporter] = matchStr.match(importRegex);
      const importer = singleQuoteImporter || doubleQuoteImporter;

      // If `import xx from '.'`
      return importer === '.' ? './src' : importer;
    }).filter(Boolean);

    const fileDirname = path.dirname(filePath);

    let importedReact = false;
    imports.forEach((i) => {
      if (i[0] === '.') {
        _code = _code.replace(i, path.resolve(fileDirname, i));
      }

      if (i === 'react') {
        importedReact = true;
      }
    });


    // If import React already
    if (!importedReact) {
      _code = `import React from 'react'; \n${_code}`;
    }
  }

  return _code;
};

module.exports = resolveImports;
