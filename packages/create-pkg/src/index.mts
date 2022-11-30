#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { downloadMaterialTemplate, generateMaterial } from '@iceworks/generate-material';
import getInfo from './langs/index.js';
import { checkEmpty } from './checkEmpty.js';
import { inquireProjectType } from './inquireProjectType.js';
import { inquirePackageName } from './inquirePackageName.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cli = cac('@ice/create-pkg');

(async () => {
  const info = await getInfo();
  // cli.command('[...args]', info.targetDir, {
  //   allowUnknownOptions: false,
  //   ignoreOptionDefaultValue: true,
  // })
  //   .action(async (args) => {
  //     const targetDirname = args[0] ?? '.';
  //     const dirPath = path.join(process.cwd(), targetDirname);
  //     await create(dirPath, targetDirname);
  //   });
  cli
    .command('[projectDir]', info.targetDir, {
      allowUnknownOptions: false, ignoreOptionDefaultValue: true,
    })
    .option('--template <template>', 'use a template e.g.: @ice/template-pkg-react')
    .action(async (projectDir, options) => {
      const targetDirname = projectDir ?? '.';
      const dirPath = path.join(process.cwd(), targetDirname);
      await create(dirPath, targetDirname, options.template);
    });
  cli.help();

  const pkgPath = path.join(__dirname, '../package.json');
  const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  consola.info(info.version, version);

  cli.version(version);

  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    consola.error(err);
    process.exit(1);
  });

async function create(dirPath: string, dirname: string, template?: string): Promise<void> {
  const info = await getInfo();
  await fs.ensureDir(dirPath);
  const empty = await checkEmpty(dirPath);

  if (!empty) {
    const { go } = await inquirer.prompt({
      type: 'confirm',
      name: 'go',
      message: info.dirExistFiles,
      default: false,
    });
    if (!go) process.exit(1);
  }

  const tempDir = path.join(dirPath, '.tmp');

  let templateNpmName = template;
  if (!templateNpmName) {
    const projectType = await inquireProjectType();
    templateNpmName = `@ice/template-pkg-${projectType}`;
  }

  await downloadMaterialTemplate(tempDir, templateNpmName);

  const npmName = await inquirePackageName();

  await generateMaterial({
    rootDir: dirPath,
    templateOptions: {
      npmName,
    },
    materialTemplateDir: tempDir,
    materialType: 'component',
    // @ts-expect-error builder type is not existed
    builder: '@ali/builder-ice-pkg',
  });

  await fs.remove(tempDir);

  console.log();
  console.log(info.initSuccess);
  console.log();
  console.log(`    cd ${dirname}`);
  console.log('    npm install');
  console.log('    npm start');
  console.log();
}

