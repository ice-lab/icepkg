#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import componentService from './index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getBuiltInPlugins = () => ['@ice/pkg-plugin-compoent'];

const cli = cac('pkg-cli');

(async () => {
  cli
    .command('build', 'Bundle files', {
      allowUnknownOptions: false,
      ignoreOptionDefaultValue: true, // only display options in help message.
    })
    .option('--config <config>', 'Use custom config')
    .option('--root--dir <rootDir>', 'Determine root directory', {
      default: 'pwd',
    })
    .action((options) => {
      delete options['--'];

      componentService.run({
        command: 'build',
        commandArgs: {
          ...options,
        },
        getBuiltInPlugins,
      });
    });

  cli
    .command('start', 'Watch files', {
      allowUnknownOptions: false,
      ignoreOptionDefaultValue: true,
    })
    .option('--config <config>', 'Use custom config')
    .option('--root--dir <rootDir>', 'Determine root directory', {
      default: 'pwd',
    })
    .option('--dist', 'Watch dist files (especially with enabled-umd)', {
      default: false,
    })
    .action((options) => {
      delete options['--'];

      componentService.run({
        command: 'start',
        commandArgs: {
          ...options,
        },
        getBuiltInPlugins,
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

