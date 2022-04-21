import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import hbs from 'handlebars';

import type { PluginDocusaurusOptions } from './index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function configureDocusaurus(rootDir: string, params: PluginDocusaurusOptions) {
  const haveStaticFiles = fs.pathExistsSync(path.join(rootDir, 'static'));
  const mobilePreview = !!params.mobilePreview;

  const templatePath = path.join(__dirname, './template/docusaurus.hbs');
  const templateContents = fs.readFileSync(templatePath, 'utf-8');

  const targetContents = hbs.compile(templateContents)({
    ...params,
    haveStaticFiles,
    mobilePreview,
  });

  // Write config to .docusaurus
  const output = path.join(rootDir, './.docusaurus');

  fs.ensureDirSync(output);
  fs.writeFileSync(path.join(output, './docusaurus.config.cjs'), targetContents, 'utf-8');
}

