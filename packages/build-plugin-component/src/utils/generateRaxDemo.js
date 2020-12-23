const path = require('path');
const { markdownParser } = require('./markdownHelper');
const generateEntry = require('./generateEntry');
const getReadme = require('./getReadme');

function generatePortalModules(context, applyMethod) {
  const { rootDir, command } = context;
  let modules = {
    device: path.join(__dirname, '../template/device.hbs'),
  };

  let params = {
    command,
  };

  const customModulesInfo = applyMethod('buildComponentProtalArrage');

  if (customModulesInfo) {
    const { modules: customModules = {}, params: extendParams = {} } = customModulesInfo || {};
    modules = {
      ...modules,
      ...customModules,
    };
    params = {
      ...params,
      ...extendParams,
    };
  }

  Object.keys(modules).forEach((key) => {
    generateEntry({
      templatePath: modules[key],
      outputPath: path.join(rootDir, `./build/${key}.js`),
      params,
    });
  });
}

function generateRaxDemo(demos, context, applyMethod) {
  const { rootDir, command, userConfig } = context;

  const modulesPath = path.join(rootDir, './build');

  const demoEntry = path.join(rootDir, 'node_modules', 'rax-demoentry.js');
  const { meta, readme } = getReadme(rootDir, markdownParser, console);

  generateEntry({
    template: 'raxEntry.hbs',
    outputPath: demoEntry,
    params: {
      targets: userConfig.targets,
      command,
      title: meta.title,
      docHtml: readme,
      demos,
      modulesPath,
    },
  });

  generatePortalModules(context, applyMethod);

  return demoEntry;
}

module.exports = generateRaxDemo;
