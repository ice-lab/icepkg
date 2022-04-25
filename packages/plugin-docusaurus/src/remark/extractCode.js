const crypto = require('crypto');
const path = require('path');
const fse = require('fs-extra');
const visit = require('unist-util-visit');
const resolveImports = require('./resolveImports');

const DEMO_PREFIX = 'IcePkgDemo';
const rootDir = process.cwd();
const previewerComponentPath = path.join(__dirname, '../Previewer/index.js');
const demoDir = path.join(rootDir, '.docusaurus/demos');
const pagesDir = path.join(rootDir, '.docusaurus/pages');

const escapeCode = (code) => {
  return (code || '')
    .replace(/`/g, '&#x60;')
    .replace(/\$/g, '&#36;');
};

/** Use the md5 value of docPath */
const uniqueFilename = (originalDocPath, count) => {
  const hash = crypto.createHash('md5');
  hash.update(originalDocPath);
  const hashValue = hash.digest('hex');

  return `${DEMO_PREFIX}${hashValue}${count}`;
};

/**
 * Remark Plugin to extract codeBlock & rendered as component
 * @param {*} options
 * @returns
 */
const plugin = (options) => {
  const { mobilePreview = false } = options;

  const transformer = async (ast, vfile) => {
    const demosMeta = [];
    let id = 0;

    await visit(ast, 'code', (node, index) => {
      if (node.meta === 'preview') {
        const { lang } = node;
        if (!['tsx', 'jsx'].includes(lang)) {
          throw new Error(`
            Found code block with lang ${lang}.\n\
            ${lang} is not supported in code preview.
          `);
        }

        fse.ensureDirSync(demoDir);

        const demoFilename = uniqueFilename(vfile.path, ++id);
        const filePath = path.join(demoDir, `${demoFilename}.${lang}`);
        const resolvedCode = resolveImports(node.value, vfile.path);

        fse.writeFileSync(filePath, resolvedCode, 'utf-8');

        fse.ensureDirSync(pagesDir);
        const pageDemo = path.join(pagesDir, `${demoFilename}.jsx`);
        const pageCode = `
          import Demo from '${filePath}';
          export default Demo;
        `;
        fse.writeFileSync(pageDemo, pageCode, 'utf-8');

        demosMeta.push({
          code: node.value,
          idx: index,
          uniqueName: demoFilename,
          filePath,
          url: `/pages/${demoFilename}`,
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
        const { idx, code, filePath, uniqueName, url } = demosMeta[m];
        const actualIdx = m === 0 ? idx + 1 : idx + 2;

        // Remove original code block and insert components
        ast.children.splice(actualIdx, 1, {
          type: 'jsx',
          value: `<Previewer code={\`${escapeCode(code)}\`} mobilePreview={${mobilePreview}} url="${url}"> <${uniqueName} /> </Previewer>`,
        }, {
          type: 'import',
          value: `import ${uniqueName} from '${filePath}';`,
        });
      }
    }
  };
  return transformer;
};

module.exports = plugin;
