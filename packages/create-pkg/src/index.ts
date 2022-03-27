#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import initMaterialAndComponent from '@appworks/cli/lib/command/init/initMaterialAndComponent.js';
import inquirer from 'inquirer';

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

  // @ts-ignore
  await initMaterialAndComponent?.default({
    cwd: dirPath,
    projectType: 'component',
    template: '@ice/template-pkg-react',
    templateFramework: 'react',
    templateLanguage: 'ts',
  });
}

async function checkEmpty(dir: string): Promise<boolean> {
  let files: string[] = fs.readdirSync(dir);
  files = files.filter((filename) => {
    return ['node_modules', '.git', '.DS_Store', '.iceworks-tmp', 'build', '.bzbconfig'].indexOf(filename) === -1;
  });
  if (files.length && files.length > 0) {
    return false;
  } else {
    return true;
  }
}
