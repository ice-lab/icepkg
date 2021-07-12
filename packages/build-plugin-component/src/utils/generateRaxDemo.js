const path = require('path');
const fse = require('fs-extra');
const { markdownParser } = require('./markdownHelper');
const generateEntry = require('./generateEntry');
const getReadme = require('./getReadme');
const { getModulesInfo } = require('./getPortalModules');
const { getRaxDemoEntryJs } = require('./handlePaths');
const formatPathForWin = require('./formatPathForWin');

function generatePortalModules(context) {
  const { rootDir } = context;
  const { modules, params } = getModulesInfo();

  Object.keys(modules).forEach((key) => {
    generateEntry({
      templatePath: modules[key],
      outputPath: path.join(rootDir, `./build/${key}.js`),
      params,
    });
  });
}

function generateRaxDemo(demos, context, applyMethod) {
  const { rootDir, command, userConfig, pkg } = context;

  const modulesPath = formatPathForWin(path.join(rootDir, './build'));

  fse.ensureDirSync(modulesPath);

  const demoEntry = getRaxDemoEntryJs(rootDir);
  const { meta, readme } = getReadme(rootDir, markdownParser, console);

  // generate portal framework
  generateEntry({
    template: 'raxEntry.hbs',
    outputPath: demoEntry,
    params: {
      targets: userConfig.targets,
      command,
      title: meta.title || pkg.name,
      docHtml: readme,
      demos,
      modulesPath,
    },
  });

  // generate portal modules, like device, demos, and so on
  generatePortalModules(context, applyMethod);

  return demoEntry;
}

module.exports = generateRaxDemo;
