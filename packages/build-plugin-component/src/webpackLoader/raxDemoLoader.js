const { dirname } = require('path');
const { markdownParser } = require('../utils/markdownHelper');

module.exports = function demoLoader(markdown) {
  const filePath = this.resourcePath;

  const { code, demoCodeSrc } = markdownParser(markdown, {
    sliceCode: true,
    demoPath: dirname(filePath),
  });

  let sourceCode = code;

  if (demoCodeSrc) {
    sourceCode = `import App from '${demoCodeSrc}';export default App;`;
  }
  return sourceCode;
};
