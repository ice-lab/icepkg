const fs = require('fs');
const path = require('path');
const { markdownParser: defaultMarkdownParser } = require('./markdownHelper');

module.exports = function getReadme(cwd, markdownParser = defaultMarkdownParser, log) {
  const filePath = path.join(cwd, 'README.md');

  let result = {};
  try {
    const markdown = fs.readFileSync(filePath, 'utf-8');
    result = markdownParser(markdown);
  } catch (err) {
    log.warn('读取/解析 README.md 错误');
    console.error(err);
  }

  return {
    meta: result.meta,
    readme: result.content,
  };
};
