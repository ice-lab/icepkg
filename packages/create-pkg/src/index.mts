#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import { downloadAndGenerateProject, checkEmpty } from '@iceworks/generate-project';
import picocolors from 'picocolors';
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

  await downloadAndGenerateProject(dirPath, '@icedesign/ice-pkg-cli-ts');

  consola.info('\n');
  consola.info('Starts the development server.');
  consola.info('\n');
  consola.info(picocolors.cyan(`    cd ${dirname}`));

  consola.info(picocolors.cyan('    npm install'));
  consola.info(picocolors.cyan('    npm start'));

  consola.info('\n');
}
