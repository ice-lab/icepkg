const path = require('path');
const fs = require('fs-extra');
const { analyzeDependencies } = require('./depAnalyze');

const parseStyleStatement = ({ target, module, rootDir }) => {
  let styleStatement = '';
  const stylePaths = ['style', `${target}/style`];
  if (target === 'es') {
    // compatible for component without es folder
    stylePaths.push('lib/style.js');
  }
  stylePaths.every((stylePath) => {
    let keepSearch = true;
    try {
      require.resolve(`${module}/${stylePath}`);
      styleStatement = `${module}/${stylePath}`;
      keepSearch = false;
    } catch (err) {
      keepSearch = true;
    }
    return keepSearch;
  });
  if (styleStatement) {
    return target === 'es'
      ? `import '${styleStatement}';`
      : `require('${styleStatement}');`;
  }
  return '';
};

module.exports = ({ rootDir, basicComponents, destPath, target, log, folder }) => {
  // analyze dependencies for generate style.js
  const styleDependencies = analyzeDependencies(
    path.join(rootDir, `${target}${folder ? `/${folder}` : ''}/index`),
    rootDir,
    basicComponents,
  );
  // generate style.js
  const stylePath = path.join(destPath, 'style.js');
  // check index.scss and main.scss
  let styleContent = '';
  ['index.scss', 'index.less', 'index.css', 'main.scss'].every((cssFile) => {
    if (fs.existsSync(path.join(destPath, cssFile))) {
      styleContent =
        target === 'es'
          ? `import './${cssFile}';`
          : `require('./${cssFile}');`;
      // return false to break loop
      return false;
    }
    return true;
  });
  const styleSatements = styleDependencies
    .map((module) => parseStyleStatement({ module, rootDir, target }))
    .join('\n');
  styleContent =
    styleSatements || styleContent
      ? [styleSatements, styleContent].filter(Boolean).join('\n')
      : '//empty file';
  fs.writeFileSync(stylePath, styleContent, 'utf-8');
  log.info(`generate style.js to ${target}`);
};
