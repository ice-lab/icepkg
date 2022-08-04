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

  const lessDocusaurusPluginPath = require.resolve('docusaurus-plugin-less', {
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
    lessDocusaurusPluginPath,
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
        rax: require.resolve('rax-compat'),
        'rax-children': require.resolve('rax-compat/children'),
        'rax-clone-element': require.resolve('rax-compat/clone-element'),
        'rax-create-class': require.resolve('rax-compat/create-class'),
        'rax-create-factory': require.resolve('rax-compat/create-factory'),
        'rax-create-portal': require.resolve('rax-compat/create-portal'),
        'rax-find-dom-node': require.resolve('rax-compat/find-dom-node'),
        'rax-is-valid-element': require.resolve('rax-compat/is-valid-element'),
        'rax-unmount-component-at-node': require.resolve('rax-compat/unmount-component-at-node'),
      }
    }
  ]
]
`;

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
    require.resolve('${require.resolve('@docusaurus/core/lib/babel/preset')}'),
    [
      require.resolve('@babel/preset-react'),
      {
        "pragma": "createElement",
        "runtime": "classic"
      },
    ],
  ],
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

  // hijack createElement to support rpx in demo preview
  fs.writeFileSync(
    path.join(output, 'hijackCreateElement.js'), hijackCreateElementModuleContent, 'utf-8',
  );
}

