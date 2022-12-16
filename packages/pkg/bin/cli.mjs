#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { require } from '../lib/utils.js';
import componentService from '../lib/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getBuiltInPlugins = () => [
  require.resolve('./plugins/component'),
];

const cli = cac('ice-pkg');

(async () => {
  cli
    .command('build', 'Bundle files', {
      allowUnknownOptions: false,
    })
    .option('--config <config>', 'specify custom config path')
    .option('--analyzer', "visualize size of output files(it's only valid in bundle mode)", {
      default: false,
    })
    .option('--rootDir <rootDir>', 'specify root directory', {
      default: process.cwd(),
    })
    .action(async (options) => {
      delete options['--'];
      const { rootDir, ...commandArgs } = options;

      await componentService.run({
        command: 'build',
        commandArgs,
        getBuiltInPlugins,
        rootDir: options.rootDir,
      });
    });

  cli
    .command('start', 'Watch files', {
      allowUnknownOptions: false,
    })
    .option('--config <config>', 'specify custom config path')
    .option('--analyzer', "visualize size of output files(it's only valid in bundle mode)", {
      default: false,
    })
    .option('--rootDir <rootDir>', 'specify root directory', {
      default: process.cwd(),
    })
    .option('--dist', 'watch dist files (especially with enabled-umd)', {
      default: false,
    })
    .action(async (options) => {
      delete options['--'];
      const { rootDir, ...commandArgs } = options;

      await componentService.run({
        command: 'start',
        commandArgs,
        getBuiltInPlugins,
        rootDir: options.rootDir,
      });
    });

  cli.help();

  const pkgPath = join(__dirname, '../package.json');
  cli.version(JSON.parse(readFileSync(pkgPath, 'utf-8')).version);

  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    consola.error(err);
    process.exit(1);
  });
