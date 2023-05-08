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
import inquireTemplateNpmName from './inquireTemplateNpmName.js';
import { inquirePackageName } from './inquirePackageName.js';
import removeFilesAndContent from './removeFilesAndContent.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cli = cac('@ice/create-pkg');

interface CliOptions {
  template?: string;
  npmName?: string;
  workspace?: boolean;
}

(async () => {
  const info = await getInfo();
  cli
    .command('[projectDir]', info.targetDir, {
      allowUnknownOptions: false,
      ignoreOptionDefaultValue: true,
    })
    .option('--template <template>', 'Create a package with the template. For example: --template=@ice/template-pkg-react')
    .option('--npmName <npmName>', 'Specify the package name. For example: --npmName=my-lib')
    .option('-w, --workspace', 'Create a package to your workspaces. For example: npm init @ice/pkg -w packages/a')
    .action(async (projectDir, options) => {
      const targetDirname = projectDir ?? '.';
      const dirPath = path.isAbsolute(targetDirname) ? targetDirname : path.join(process.cwd(), targetDirname);
      await create(dirPath, targetDirname, options);
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

async function create(dirPath: string, dirname: string, options: CliOptions): Promise<void> {
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

  let templateNpmName = options.template;
  if (!templateNpmName) {
    templateNpmName = await inquireTemplateNpmName();
  }

  const npmName = options.npmName ?? (templateNpmName.startsWith('@ice/template-pkg-monorepo') ? '' : await inquirePackageName());

  await downloadMaterialTemplate(tempDir, templateNpmName);

  await generateMaterial({
    rootDir: dirPath,
    templateOptions: {
      npmName,
      // @ts-expect-error generateMaterial should support index signature.
      workspace: options.workspace,
    },
    materialTemplateDir: tempDir,
    materialType: 'component',
    builder: '@ali/builder-ice-pkg',
  });

  await fs.remove(tempDir);

  if (options.workspace) {
    await removeFilesAndContent(dirPath);
  }

  console.log();
  console.log(info.initSuccess);
  console.log();
  console.log(`    cd ${dirname}`);
  console.log('    npm install');
  console.log('    npm start');
  console.log();
}
