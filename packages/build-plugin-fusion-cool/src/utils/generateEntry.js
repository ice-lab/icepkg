const path = require('path');
const fs = require('fs');
const hbs = require('handlebars');

/**
 * @description generate js file as webpack entry
 * @param {String} template template path
 * @param {String} filename
 * @param {String} rootDir
 * @param {Object} params params for compile template content
 * @returns {String} path of entry file
 */
module.exports = function generateEntryJS({
  template,
  filename = 'index.js',
  rootDir = process.cwd(),
  params,
}) {
  const hbsTemplatePath = path.join(__dirname, `../template/${template}`);
  const hbsTemplateContent = fs.readFileSync(hbsTemplatePath, 'utf-8');
  const compileTemplateContent = hbs.compile(hbsTemplateContent);

  const tempDir = path.join(rootDir, './node_modules');
  const jsPath = path.join(tempDir, filename);

  const jsTemplateContent = compileTemplateContent(params);
  fs.writeFileSync(jsPath, jsTemplateContent);

  return jsPath;
};
