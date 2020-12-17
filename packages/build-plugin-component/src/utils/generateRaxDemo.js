const path = require('path');
const { markdownParser } = require('./markdownHelper');
const generateEntry = require('./generateEntry');
const getReadme = require('./getReadme');
const { HerboxUrlEnv, HerboxUrlProd } = require('../constants');

function generateRaxDemo(demos, context, herboxName) {
  const { rootDir, command, userConfig } = context;

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
      herboxUrl: herboxName === '' ? '' : `${command === 'build' ? HerboxUrlProd : HerboxUrlEnv}${herboxName}`,
      demos,
    },
  });

  return demoEntry;
}

module.exports = generateRaxDemo;