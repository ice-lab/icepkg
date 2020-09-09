const path = require('path');
const { markdownParser } = require('./markdownHelper');
const generateEntry = require('./generateEntry');
const getReadme = require('./getReadme');

function generateRaxDemo(demos, context) {
  const { rootDir, command, userConfig } = context;

  const demoEntry = path.join(rootDir, 'node_modules', `rax-demoentry.js`);
  const { meta, readme } = getReadme(rootDir, markdownParser, console);
  console.log(getReadme(rootDir, markdownParser, console));
  generateEntry({
    template: 'raxEntry.hbs',
    outputPath: demoEntry,
    params: {
      targets: userConfig.targets,
      command,
      title: meta.title,
      docHtml: readme,
      demos,
    },
  });

  return demoEntry;
}

module.exports = generateRaxDemo;