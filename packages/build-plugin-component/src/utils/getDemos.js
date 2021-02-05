/**
 * get demos from demo dir
 */
const { readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const camelcase = require('camelcase');
const { markdownParser: defaultMarkdownParser } = require('../utils/markdownHelper');

module.exports = function getDemos(demoPath, markdownParser = defaultMarkdownParser) {
  if (!existsSync(demoPath)) {
    return [];
  }

  return readdirSync(demoPath)
    .filter((file) => /\.md$/.test(file))
    .map((filename) => {
      const filePath = join(demoPath, filename);
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

      filename = filename.replace(/\.md$/, '');
      const href = `/?demo=${filename}`;

      return {
        href,
        filename,
        pascalCaseName: camelcase(filename, { pascalCase: true }),
        filePath,
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
