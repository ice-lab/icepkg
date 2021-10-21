const { join, basename, dirname } = require('path');
const { existsSync } = require('fs');
const { parse } = require('@babel/parser');
const t = require('@babel/types');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');
const loaderUtils = require('loader-utils');
const { markdownParser } = require('../utils/markdownHelper');


module.exports = function demoLoader(markdown) {
  const options = loaderUtils.getOptions(this);

  const filePath = this.resourcePath;
  const fileName = basename(filePath, '.md');

  const { code, demoCodeSrc } = markdownParser(markdown, {
    sliceCode: true,
    demoPath: dirname(filePath),
  });
  // get style file
  let styleStatement = '';
  let stylePath = '';

  if (options && !options.disableGenerateStyle) {
    ['index.scss', 'index.less', 'index.css', 'main.scss'].every((file) => {
      stylePath = join(process.cwd(), 'src', file);
      if (existsSync(stylePath)) {
        styleStatement = `import ${JSON.stringify(stylePath)};`;
        return false;
      }
      return true;
    });
  }

  let sourceCode = '';
  const mountNode = `const mountNode = document.getElementById('${fileName}');`;

  if (demoCodeSrc) {
    sourceCode = `import App from '${demoCodeSrc}';${styleStatement};export default App;`;
  } else {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy', 'dynamicImport', 'classProperties'],
    });
    const visitor = {
      Program(nodePath) {
        if (styleStatement) {
          const { body } = nodePath.node;
          let lastImportIndex = 0;
          body.forEach((item, index) => {
            if (t.isImportDeclaration(item)) {
              lastImportIndex = index;
            }
          });
          const newImport = t.importDeclaration(
            [],
            t.stringLiteral(stylePath),
          );
          body.splice(lastImportIndex + 1, 0, newImport);
        }
      },
      ExpressionStatement(nodePath) {
        const { expression } = nodePath.node;
        let match = false;
        if (
          expression &&
          ((t.isMemberExpression(expression.callee) &&
            t.isIdentifier(expression.callee.object, { name: 'ReactDOM' }) &&
            t.isIdentifier(expression.callee.property, { name: 'render' })) ||
            t.isIdentifier(expression.callee, { name: 'render' }))
        ) {
          match = true;
        }
        if (match && expression.arguments && expression.arguments[0]) {
          const jsxElement = expression.arguments[0];
          let defaultDeclaration = null;
          if (jsxElement.openingElement && jsxElement.openingElement.selfClosing) {
            // render selfClosing element
            // ReactDOM.render(<App />, mountNode) => export default App;
            defaultDeclaration = t.identifier(jsxElement.openingElement.name.name);
          } else if (t.isJSXElement(jsxElement)) {
            // export default function component
            // ReactDOM.render(<App name="xx">abc</App>, mountNode) => export default () => (<App name="xx">abc</App>);
            defaultDeclaration = t.arrowFunctionExpression([], jsxElement);
          }
          // export default function component
          if (defaultDeclaration) {
            nodePath.replaceWith(t.ExportDefaultDeclaration(defaultDeclaration));
          }
        }
      },
    };
    traverse.default(ast, visitor);
    sourceCode = generator.default(ast).code;
  }

  // eslint-disable-next-line quotes
  const requireReact = `window.React = require('react');window.ReactDOM = require('react-dom');`;

  // inject code for demos which do not import React or ReactDOM
  return `${mountNode}${requireReact}${
    sourceCode
  }`;
};
