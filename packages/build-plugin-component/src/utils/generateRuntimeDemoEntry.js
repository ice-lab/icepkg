const path = require('path');
const fse = require('fs-extra');
const hbs = require('handlebars');

module.exports = function (demos, outputPath) {
  const hbsTemplatePath = path.resolve(__dirname, '../template/runtimeMiniappDemoEntry.hbs');
  const hbsTemplateContent = fse.readFileSync(hbsTemplatePath, 'utf-8');
  const compileTemplateContent = hbs.compile(hbsTemplateContent);
  const jsTemplateContent = compileTemplateContent({
    demos,
  });

  const demoEntryPath = path.resolve(outputPath, 'node_modules/.runtime-preview-entry/index.jsx');

  fse.outputFileSync(demoEntryPath, jsTemplateContent, 'utf-8');

  return demoEntryPath;
};
