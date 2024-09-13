import path from 'node:path';
import { Worker, MessagePort } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { DeclarationTaskConfig, OutputResult, TaskRunnerContext, WatchChangedFile } from '../types.js';
import globby from 'globby';
import { Runner } from '../helpers/runner.js';
import { Rpc } from '../helpers/rpc.js';
import { DeclarationMainMethods, DeclarationWorkerMethods } from './declaration.rpc.js';
import { getExistedChangedFilesPath } from '../helpers/watcher.js';
import { getTransformEntryDirs } from '../helpers/getTaskIO.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export function createDeclarationTask(context: TaskRunnerContext) {
  return new DeclarationRunner(context);
}

class DeclarationRunner extends Runner<OutputResult> {
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  override get isParallel() {
    return true;
  }

  async doRun(changedFiles?: WatchChangedFile[]) {
    const { context } = this;
    // getTransformEntryDirs
    // TODO: 应该使用和 transform 一致的目录
    let files: string[];

    if (changedFiles) {
      files = getExistedChangedFilesPath(changedFiles);
    } else {
      const entryDirs = getTransformEntryDirs(context.buildContext.rootDir, context.buildTask.config.entry as Record<string, string>);
      const result = await Promise.all(entryDirs.map((entry) => globby('**/*.{ts,tsx,mts,cts}', {
        cwd: entry,
        onlyFiles: true,
        ignore: ['**/*.d.{ts,mts,cts}'],
        absolute: true,
      })));
      // unique files
      const filesSet = new Set<string>();
      for (const item of result) {
        for (const file of item) {
          filesSet.add(file);
        }
      }
      files = Array.from(filesSet);
    }
    const worker = new Worker(path.join(dirname, './declaration.worker.js'));
    const rpc = new Rpc<DeclarationWorkerMethods, DeclarationMainMethods>(worker as unknown as MessagePort, {
    });

    const buildConfig = context.buildTask.config as DeclarationTaskConfig;
    await rpc.call('run', [buildConfig.declarationOutputDirs, {
      files,
      rootDir: context.buildContext.rootDir,
      outputDir: buildConfig.outputDir,
      alias: buildConfig.alias,
      usingOxc: buildConfig.generator === 'oxc',
    }]);

    await worker.terminate();

    return {
      taskName: context.buildTask.name,
      outputs: [],
      outputFiles: [],
    };
  }
}
