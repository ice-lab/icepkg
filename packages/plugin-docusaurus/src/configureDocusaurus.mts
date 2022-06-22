import path from 'path';
import consola from 'consola';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import hbs from 'handlebars';
import { createRequire } from 'module';
import { DOCUSAURUS_DIR, DOCUSAURUS_CONFIG_FILE, DOCUSAURUS_BABEL_CONFIG_FILE } from './constants.mjs';

import type { ConfigureDocusaurusOptions } from './index.mjs';

const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function configureDocusaurus(rootDir: string, params: ConfigureDocusaurusOptions) {
  const docusaurusClassPresetPath = require.resolve('@docusaurus/preset-classic', {
    paths: [__dirname, rootDir],
  });

  const sassDocusaurusPluginPath = require.resolve('docusaurus-plugin-sass', {
    paths: [__dirname, rootDir],
  });

  const sidebarItemsGenerator = params?.sidebarItemsGenerator
    ? params?.sidebarItemsGenerator.toString()
    : false;

  const haveStaticFiles = fs.pathExistsSync(path.join(rootDir, 'static'));
  const mobilePreview = !!params.mobilePreview;

  const prismReactRendererPath = path.dirname(require.resolve('prism-react-renderer/package.json', {
    paths: [rootDir, __dirname],
  }));

  const templatePath = path.join(__dirname, './template/docusaurus.hbs');
  const templateContents = fs.readFileSync(templatePath, 'utf-8');

  const targetContents = hbs.compile(templateContents)({
    ...params,
    docusaurusClassPresetPath,
    sidebarItemsGenerator,
    haveStaticFiles,
    mobilePreview,
    prismReactRendererPath,
    sassDocusaurusPluginPath,
  });

  const configuredPlugins = params?.configuredPlugins;
  const isUsingRax = configuredPlugins.some((plugin) => plugin.name === '@ice/pkg-plugin-rax-component');

  if (isUsingRax) {
    consola.warn('You are developing a rax component with compat mode which will alias rax to rax-compat');
  }

  const raxAliasBabelPluginConfigContents = `
plugins: [
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      alias: {
        rax: 'rax-compat',
        'rax-children': 'rax-compat/children',
        'rax-clone-element': 'rax-compat/clone-element',
        'rax-create-class': 'rax-compat/create-class',
        'rax-create-factory': 'rax-compat/create-factory',
        'rax-create-portal': 'rax-compat/create-portal',
        'rax-find-dom-node': 'rax-compat/find-dom-node',
        'rax-is-valid-element': 'rax-compat/is-valid-element',
        'rax-unmount-component-at-node': 'rax-compat/unmount-component-at-node',
      }
    }
  ]
]
`;
  const babelConfigContents = `
module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  ${isUsingRax ? raxAliasBabelPluginConfigContents : ''}
};`;

  // Write config to .docusaurus
  const output = path.join(rootDir, DOCUSAURUS_DIR);
  fs.ensureDirSync(output);
  fs.writeFileSync(path.join(output, DOCUSAURUS_CONFIG_FILE), targetContents, 'utf-8');
  // babel config for rax components doc build
  fs.writeFileSync(
    path.join(output, DOCUSAURUS_BABEL_CONFIG_FILE), babelConfigContents, 'utf-8',
  );
}

