const path = require('path');
const fs = require('fs');
const hbs = require('handlebars');

module.exports = function generateEntryJS({
  template,
  outputPath,
  params,
}) {
  const hbsTemplatePath = path.join(__dirname, `../template/${template}`);
  const hbsTemplateContent = fs.readFileSync(hbsTemplatePath, 'utf-8');
  hbs.registerHelper('camelCased', (str) => {
    return str.replace(/-([a-z])/g, (math) => (math[1].toUpperCase()));
  });
  const compileTemplateContent = hbs.compile(hbsTemplateContent);

  const jsTemplateContent = compileTemplateContent(params);
  fs.writeFileSync(outputPath, jsTemplateContent);
};
