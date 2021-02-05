const fse = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');

const jsHbsTemplatePath = path.join(__dirname, '../template/runtimeMiniappPage.hbs');
const hbsTemplateContent = fse.readFileSync(jsHbsTemplatePath, 'utf-8');

module.exports = function (outputPath, name) {
  const tmplDir = path.resolve(__dirname, '../template/miniapp/ali-miniapp-runtime/pages/Demo/');
  const files = ['index.acss', 'index.json', 'index.axml'];

  // copy acss, json, axml files
  files.forEach((filename) => {
    fse.copySync(path.resolve(tmplDir, filename), path.resolve(outputPath, filename));
  });

  // generate pages/{demo}/index.js
  const compileContent = hbs.compile(hbsTemplateContent);
  const jsTemplateContent = compileContent({
    pageName: name,
  });

  fse.writeFileSync(path.resolve(outputPath, 'index.js'), jsTemplateContent);
};
