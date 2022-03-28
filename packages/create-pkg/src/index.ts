#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { downloadMaterialTemplate, generateMaterial } from '@iceworks/generate-material';
import { checkEmpty } from './checkEmpty.js';
import { initInquirer } from './initInquirer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cli = cac('@ice/create-pkg');

(async () => {
  cli.command('[...args]', 'Target dirname to generate', {
    allowUnknownOptions: false,
    ignoreOptionDefaultValue: true,
  })
    .action(async (args) => {
      const targetDirname = args[0] ?? '.';

      const dirPath = path.join(process.cwd(), targetDirname);
      await create(dirPath, targetDirname);
    });

  cli.help();

  const pkgPath = path.join(__dirname, '../package.json');
  const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  consola.info('@ice/create-pkg version: ', version);

  cli.version(version);

  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    consola.error(err);
    process.exit(1);
  });

async function create(dirPath: string, dirname: string): Promise<void> {
  await fs.ensureDir(dirPath);
  const empty = await checkEmpty(dirPath);

  if (!empty) {
    const { go } = await inquirer.prompt({
      type: 'confirm',
      name: 'go',
      message:
          'Files exist in the current directory already. Are you sure to continue ？',
      default: false,
    });
    if (!go) process.exit(1);
  }

  const tempDir = path.join(dirPath, '.tmp');

  await downloadMaterialTemplate(tempDir, '@ice/template-pkg-react');

  const inquirAnwsers = await initInquirer(dirPath);

  await generateMaterial({
    rootDir: dirPath,
    templateOptions: inquirAnwsers,
    materialTemplateDir: tempDir,
    materialType: 'component',
  });

  await fs.remove(tempDir);

  console.log();
  console.log('Initialize component successfully.');
  console.log();
  console.log(`    cd ${dirname}`);
  console.log('    npm install');
  console.log('    npm start');
  console.log();
}

