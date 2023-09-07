import path from 'path';
import consola from 'consola';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import hbs from 'handlebars';
import { createRequire } from 'module';
import { DOCUSAURUS_DIR, DOCUSAURUS_CONFIG_FILE, DOCUSAURUS_BABEL_CONFIG_FILE } from './constants.mjs';
import type { PluginDocusaurusOptions } from './types.mjs';
import type { PluginAPI } from '@ice/pkg';
// @ts-expect-error export default error
import formatWinPath from './formatWinPath.cjs';

export interface ConfigureDocusaurusOptions extends PluginDocusaurusOptions {
  configuredPlugins: ReturnType<PluginAPI['getAllPlugin']>;
}

const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function configureDocusaurus(rootDir: string, params: ConfigureDocusaurusOptions) {
  const docusaurusClassPresetPath = require.resolve('@docusaurus/preset-classic', {
    paths: [__dirname, rootDir],
  });

  const docusaurusPluginContentPagesPath = require.resolve('@docusaurus/plugin-content-pages', {
    paths: [__dirname, rootDir],
  });

  const sidebarItemsGenerator = params?.sidebarItemsGenerator
    ? params?.sidebarItemsGenerator.toString()
    : false;

  const haveStaticFiles = fse.pathExistsSync(path.join(rootDir, 'static'));
  const mobilePreview = !!params.mobilePreview;

  const prismReactRendererPath = path.dirname(require.resolve('prism-react-renderer/package.json', {
    paths: [rootDir, __dirname],
  }));

  const templatePath = path.join(__dirname, './template/docusaurus.hbs');
  const templateContents = fse.readFileSync(templatePath, 'utf-8');

  const targetContents = hbs.compile(templateContents)({
    ...params,
    docusaurusClassPresetPath: formatWinPath(docusaurusClassPresetPath),
    sidebarItemsGenerator,
    haveStaticFiles,
    mobilePreview,
    prismReactRendererPath: formatWinPath(prismReactRendererPath),
    docusaurusPluginContentPagesPath: formatWinPath(docusaurusPluginContentPagesPath),
  });

  const configuredPlugins = params?.configuredPlugins;
  const isUsingRax = configuredPlugins.some((plugin) => plugin.name === '@ice/pkg-plugin-rax-component');

  if (isUsingRax) {
    consola.warn('You are developing a rax component with compat mode which will alias rax to rax-compat');
  }

  const hijackCreateElementModuleContent = `
  import { createElement as _createElement } from 'react';
  import { convertUnit } from 'style-unit';

  function isObject(obj) {
    return typeof obj === 'object';
  }

  // From @ice/jsx-runtime
  function hijackElementProps(props) {
    if (props && 'style' in props) {
      const { style } = props;
      if (isObject(style)) {
        const result = Object.assign({}, props);
        const convertedStyle = {};
        for (const prop in style) {
          convertedStyle[prop] = convertUnit(style[prop]);
        }
        result['style'] = convertedStyle;
        return result;
      }
    }
    return props;
  }

  export default function createElement(component, props, ...children) {
    return _createElement(component, hijackElementProps(props), ...children);
  }
  `;

  const babelConfigContents = `
module.exports = {
  presets: [
    require.resolve('${formatWinPath(require.resolve('@docusaurus/core/lib/babel/preset'))}'),
    [
      require.resolve('@babel/preset-react'),
      {
        "pragma": "createElement",
        "pragmaFrag": "Fragment",
        "runtime": "classic"
      },
    ],
  ],
};`;

  // Write config to .docusaurus
  const output = path.join(rootDir, DOCUSAURUS_DIR);
  fse.ensureDirSync(output);

  // write a empty package.json to avoid docusaurus read the package.json in the root dir
  fse.writeJSONSync(path.join(output, 'package.json'), {});

  // docusaurus config
  fse.writeFileSync(path.join(output, DOCUSAURUS_CONFIG_FILE), targetContents, 'utf-8');

  // babel config for rax components doc build
  fse.writeFileSync(
    path.join(output, DOCUSAURUS_BABEL_CONFIG_FILE), babelConfigContents, 'utf-8',
  );

  // hijack createElement to support rpx in demo preview
  fse.writeFileSync(
    path.join(output, 'hijackCreateElement.js'), hijackCreateElementModuleContent, 'utf-8',
  );

  // A package.json exists in the .docusaurus file, to fix the package can not be required in md file(docs)
  createSymbolicLink(
    rootDir,
    path.join(rootDir, 'node_modules', require(path.join(rootDir, 'package.json')).name),
  );
}

function createSymbolicLink(src: string, dest: string) {
  if (fse.pathExistsSync(dest) && fse.lstatSync(dest)) {
    fse.unlinkSync(dest);
  }

  fse.ensureSymlinkSync(src, dest);
}
