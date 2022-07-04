/**
 * get demos from demo dir
 */
const { readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const camelcase = require('camelcase');
const { markdownParser: defaultMarkdownParser } = require('../utils/markdownHelper');
const formatPathForWin = require('./formatPathForWin');
const getReactDocs = require('./getReactDocs');

module.exports = function getDemos(demoPath, markdownParser = defaultMarkdownParser, rootPath) {
  if (!existsSync(demoPath)) {
    return [];
  }

  return readdirSync(demoPath)
    .filter((file) => /\.md$/.test(file))
    .map((filename) => {
      const filePath = formatPathForWin(join(demoPath, filename));
      const content = readFileSync(filePath, 'utf-8');

      const {
        meta,
        highlightedCode,
        content: markdownContent,
        highlightedStyle,
        code,
      } = markdownParser(content, {
        sliceCode: true,
        demoPath,
      });

      let reactDocs;
      if (meta.docGenIncludes) {
        reactDocs = getReactDocs(rootPath, meta.docGenIncludes);
      }

      filename = filename.replace(/\.md$/, '');
      const href = `/?demo=${filename}`;

      return {
        href,
        filename,
        pascalCaseName: camelcase(filename, { pascalCase: true }),
        filePath,
        reactDocs,
        ...meta,
        highlightedCode,
        markdownContent,
        highlightedStyle,
        code,
      };
    })
    .sort((a, b) => {
      return a.order - b.order;
    });
};
