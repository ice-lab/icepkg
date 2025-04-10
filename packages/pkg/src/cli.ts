import { fileURLToPath } from 'node:url';
import consola from 'consola';
import { cac } from 'cac';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createPkg } from './core/createPkg.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

      const pkg = await createPkg({
        rootDir: options.rootDir,
        command: 'build',
        commandArgs,
      });

      await pkg.run();
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
    .action(async (options) => {
      delete options['--'];
      const { rootDir, ...commandArgs } = options;

      const pkg = await createPkg({
        rootDir: options.rootDir,
        command: 'start',
        commandArgs,
      });

      await pkg.run();
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
