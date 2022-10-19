
const path = require('path');
const visit = require('unist-util-visit');
const checkCodeLang = require('./checkCodeLang.js');
const { getDemoFileInfo, getPageFileInfo } = require('./getFileInfo.js');
const genDemoPages = require('./genDemoPages.js');

const rootDir = process.cwd();
const previewerComponentPath = path.join(__dirname, '../Previewer/index.js');

const escapeCode = (code) => {
  return (code || '')
    .replace(/`/g, '&#x60;')
    .replace(/\$/g, '&#36;');
};

/**
 * Remark Plugin to extract codeBlock & rendered as component
 * @param {*} options
 * @returns
 */
const plugin = (options) => {
  const { mobilePreview = false, baseUrl = '/' } = options;

  const transformer = async (ast, vfile) => {
    const demosMeta = [];

    await visit(ast, 'code', (node, index) => {
      if (node.meta === 'preview') {
        const { lang } = node;
        checkCodeLang(lang);
        const { demoFilename, demoFilepath } = getDemoFileInfo({
          rootDir,
          filepath: vfile.path,
          lang,
        });
        const { pageFilename, pageFileCode } = getPageFileInfo({
          rootDir,
          demoFilepath,
          demoFilename,
        });
        genDemoPages({ filepath: vfile.path, code: node.value, demoFilename, demoFilepath, pageFilename, pageFileCode });

        demosMeta.push({
          code: node.value,
          idx: index,
          demoFilename,
          demoFilepath,
          url: baseUrl.startsWith('/') ? path.join(baseUrl, 'pages', demoFilename) : `/${path.join(baseUrl, 'pages', demoFilename)}`,
        });
      }
    });

    if (demosMeta.length) {
      // Import Previewer ahead
      ast.children.unshift({
        type: 'import',
        value: `import Previewer from '${previewerComponentPath}';`,
      });

      for (let m = 0; m < demosMeta.length; ++m) {
        const { idx, code, demoFilepath, demoFilename, url } = demosMeta[m];
        const actualIdx = m === 0 ? idx + 1 : idx + 2;

        // Remove original code block and insert components
        ast.children.splice(actualIdx, 1, {
          type: 'jsx',
          value: `
<Previewer code={\`${escapeCode(code)}\`} mobilePreview={${mobilePreview}} url="${url}">
  <BrowserOnly>
    {() => {
      const ${demoFilename} = require('${demoFilepath}').default;
      return <${demoFilename} />;
    }}
  </BrowserOnly>
</Previewer>`,
        }, {
          type: 'import',
          value: 'import BrowserOnly from \'@docusaurus/BrowserOnly\';',
        });
      }
    }
  };
  return transformer;
};

module.exports = plugin;
