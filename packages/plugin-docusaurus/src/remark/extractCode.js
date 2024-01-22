const path = require('path');
const visit = require('unist-util-visit');
const checkCodeLang = require('./checkCodeLang.js');
const { getDemoFileInfo, getPageFileInfo } = require('./getFileInfo.js');
const genDemoPages = require('./genDemoPages.js');
const formatWinPath = require('../formatWinPath.cjs');

const rootDir = process.cwd();
const previewerComponentPath = formatWinPath(path.join(__dirname, '../Previewer/index.js'));

const escapeCode = (code) => {
  return (code || '').replace(/`/g, '&#x60;').replace(/\$/g, '&#36;');
};

/**
 * Remark Plugin to extract codeBlock & rendered as component
 * @type {import('unified').Plugin}
 * @param {options: { mobilePreview: boolean; baseUrl: string; mobilePreviewUrlParams: string; }}
 */
const extractCodePlugin = (options) => {
  const { mobilePreview = false, baseUrl = '/', mobilePreviewUrlParams = '' } = options;

  const transformer = (ast, vfile) => {
    const demosMeta = [];
    let demoIndex = 0;
    visit(ast, 'code', (node, index) => {
      if (node.meta === 'preview') {
        const { lang } = node;
        checkCodeLang(lang);
        const { demoFilename, demoFilepath } = getDemoFileInfo({
          rootDir,
          filepath: vfile.path,
          lang,
          code: node.value,
          index: demoIndex,
        });
        const { pageFilename, pageFileCode } = getPageFileInfo({
          rootDir,
          demoFilepath,
          demoFilename,
        });
        genDemoPages({
          filepath: vfile.path,
          code: node.value,
          demoFilename,
          demoFilepath,
          pageFilename,
          pageFileCode,
        });

        demosMeta.push({
          code: node.value,
          idx: index,
          demoFilename,
          demoFilepath,
          url: `${path.join(baseUrl.startsWith('/') ? '' : '/', baseUrl, 'demos', demoFilename, '/')}?${mobilePreviewUrlParams}`,
        });
        demoIndex += 1;
      }
    });

    if (demosMeta.length) {
      // Remove original <CodeBlock> component and insert custom <Previewer> component
      for (let m = 0; m < demosMeta.length; ++m) {
        const { idx, code, demoFilepath, demoFilename, url } = demosMeta[m];
        ast.children.splice(idx, 1, {
          type: 'jsx',
          value: `
<Previewer code={\`${escapeCode(code)}\`} mobilePreview={${mobilePreview}} url="${url}">
  <BrowserOnly>
    {() => {
      const ${demoFilename} = require('${formatWinPath(demoFilepath)}').default;
      return <${demoFilename} />;
    }}
  </BrowserOnly>
</Previewer>`,
        });
      }

      // Import <Previewer /> ahead.
      ast.children.unshift({
        type: 'import',
        value: `import Previewer from '${previewerComponentPath}';`,
      });

      // Import <BrowserOnly /> ahead.
      ast.children.unshift({
        type: 'import',
        value: "import BrowserOnly from '@docusaurus/BrowserOnly';",
      });
    }
  };

  return transformer;
};

module.exports = extractCodePlugin;
