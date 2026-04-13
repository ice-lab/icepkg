import { fileURLToPath } from 'node:url';
import { consola } from 'consola';
import * as chokidar from 'chokidar';
import { cac } from 'cac';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createCore } from './core/create.js';
import type { FSWatcher } from 'chokidar';
import type { StartCommandHandle, StartCloseReason, BuildCommandHandle } from './types.js';
import { createBatchChangeHandler } from './helpers/watcher.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cli = cac('ice-pkg');

function getSignalExitCode(signal: NodeJS.Signals): number {
  return signal === 'SIGINT' ? 130 : 143;
}

function exitWithSignal(signal: NodeJS.Signals): never {
  process.exit(getSignalExitCode(signal));
}

async function runBuildWithSignalClose(options: { rootDir: string; [key: string]: unknown }) {
  delete options['--'];
  const { rootDir, ...commandArgs } = options;

  const pkg = await createCore({
    rootDir,
    command: 'build',
    commandArgs,
  });

  let commandHandle: BuildCommandHandle | null = null;

  const shutdown = (signal: NodeJS.Signals) => {
    exitWithSignal(signal);
  };

  const onSigint = () => shutdown('SIGINT');
  const onSigterm = () => shutdown('SIGTERM');
  process.on('SIGINT', onSigint);
  process.on('SIGTERM', onSigterm);

  try {
    commandHandle = (await pkg.run()) as BuildCommandHandle;

    if (commandHandle.error) {
      await commandHandle.dispose('build-error');
      throw commandHandle.error;
    }

    await commandHandle.dispose('build-finished');
  } finally {
    process.off('SIGINT', onSigint);
    process.off('SIGTERM', onSigterm);
  }
}

async function runStartWithConfigRestart(options: { rootDir: string; [key: string]: unknown }) {
  delete options['--'];
  const { rootDir, ...commandArgs } = options;

  let currentPkg: Awaited<ReturnType<typeof createCore>> | null = null;
  let currentCommand: StartCommandHandle | null = null;
  let currentCommandClosed = false;
  let configWatcher: FSWatcher | null = null;
  let watchedConfigFile: string | null = null;
  let shuttingDown = false;
  let disposing = false;

  const batchHandler = createBatchChangeHandler(restartStartRuntime);

  async function createAndRunStart() {
    const pkg = await createCore({
      rootDir,
      command: 'start',
      commandArgs,
    });
    const runtime = (await pkg.run()) as StartCommandHandle;
    currentPkg = pkg;
    currentCommand = runtime;
    currentCommandClosed = false;
  }

  async function closeCurrentRuntime(reason: StartCloseReason) {
    if (!currentCommand || currentCommandClosed) {
      return;
    }
    currentCommandClosed = true;
    disposing = true;
    try {
      await currentCommand.dispose(reason);
    } finally {
      disposing = false;
    }
  }

  async function updateConfigWatcher() {
    const nextConfigFile = currentPkg?.resolvedConfigFile ?? null;
    if (nextConfigFile === watchedConfigFile) {
      return;
    }

    await configWatcher?.close();
    configWatcher = null;
    watchedConfigFile = nextConfigFile;

    if (!watchedConfigFile) {
      return;
    }

    configWatcher = chokidar.watch([watchedConfigFile], {
      ignoreInitial: true,
      ignorePermissionErrors: true,
    });

    configWatcher.on('add', batchHandler.onChange);
    configWatcher.on('change', batchHandler.onChange);
    configWatcher.on('unlink', batchHandler.onChange);
    configWatcher.on('error', (error) => consola.error(error));
  }

  async function restartStartRuntime() {
    if (shuttingDown) {
      return;
    }

    try {
      consola.info('Configuration changed, restarting...');
      await closeCurrentRuntime('config-change');
      await createAndRunStart();
      await updateConfigWatcher();
    } catch (error) {
      consola.error(error);
    }
  }

  async function shutdown(signal: NodeJS.Signals) {
    if ((signal === 'SIGINT' && disposing) || shuttingDown) {
      exitWithSignal(signal);
    }
    shuttingDown = true;

    await configWatcher?.close();
    configWatcher = null;

    const shutdownHintTimer =
      signal === 'SIGINT'
        ? setTimeout(() => {
            consola.warn('Still shutting down. Please wait, or press Ctrl+C again to force exit.');
          }, 1000)
        : null;

    try {
      await closeCurrentRuntime('signal-exit');
    } catch (error) {
      consola.error(error);
    } finally {
      if (shutdownHintTimer) {
        clearTimeout(shutdownHintTimer);
      }
    }

    exitWithSignal(signal);
  }

  const onSigint = () => {
    void shutdown('SIGINT');
  };
  const onSigterm = () => {
    void shutdown('SIGTERM');
  };

  process.on('SIGINT', onSigint);
  process.on('SIGTERM', onSigterm);

  await createAndRunStart();
  await updateConfigWatcher();
}

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
      await runBuildWithSignalClose(options);
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
    .option('--server', 'Override server config', {})
    .option('--port <port>', 'Override default server port', {})
    .option('--host <host>', 'Override default server host', {})
    .action(async (options) => {
      await runStartWithConfigRestart(options);
    });

  cli.help();

  const pkgPath = join(__dirname, '../package.json');
  cli.version(JSON.parse(readFileSync(pkgPath, 'utf-8')).version);

  cli.parse(process.argv, { run: true });
})().catch((err) => {
  consola.error(err);
  process.exit(1);
});
