import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import hbs from 'handlebars';
import { createRequire } from 'module';

import type { PluginDocusaurusOptions } from './index.mjs';

const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function configureDocusaurus(rootDir: string, params: PluginDocusaurusOptions) {
  const docusaurusClassPresetPath = require.resolve('@docusaurus/preset-classic', {
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
  });

  // Write config to .docusaurus
  const output = path.join(rootDir, './.docusaurus');

  fs.ensureDirSync(output);
  fs.writeFileSync(path.join(output, './docusaurus.config.cjs'), targetContents, 'utf-8');
}

