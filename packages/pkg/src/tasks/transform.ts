import { performance } from 'perf_hooks';
import { isAbsolute, resolve, extname, dirname, relative, basename } from 'path';
import fs from 'fs-extra';
import semver from 'semver';
import consola from 'consola';
import { loadEntryFiles, loadSource, INCLUDES_UTF8_FILE_TYPE } from '../helpers/load.js';
import { createPluginContainer } from '../helpers/pluginContainer.js';
import { checkDependencyExists, isObject, timeFrom } from '../utils.js';
import type {
  OutputFile,
  OutputResult,
  TaskRunnerContext,
  TransformTaskConfig,
  WatchChangedFile,
} from '../types.js';
import type { RollupOptions, SourceMapInput } from 'rollup';
import { getTransformEntryDirs } from '../helpers/getTaskIO.js';
import { getRollupOptions } from '../helpers/getRollupOptions.js';
import { Runner } from '../helpers/runner.js';
import { getExistedChangedFilesPath } from '../helpers/watcher.js';

export function createTransformTask(taskRunnerContext: TaskRunnerContext) {
  return new TransformRunner(taskRunnerContext);
}

class TransformRunner extends Runner<OutputResult> {
  private rollupOptions: RollupOptions;

  constructor(taskRunnerContext: TaskRunnerContext) {
    super(taskRunnerContext);
    this.rollupOptions = getRollupOptions(taskRunnerContext.buildContext, taskRunnerContext);
    if (taskRunnerContext.watcher) {
      const entryDirs = getTransformEntryDirs(
        taskRunnerContext.buildContext.rootDir,
        taskRunnerContext.buildTask.config.entry as Record<string, string>,
      );
      taskRunnerContext.watcher.add(entryDirs);
    }
  }

  override doRun(files?: WatchChangedFile[]): Promise<OutputResult> {
    return runTransform(this, this.rollupOptions, files ? getExistedChangedFilesPath(files) : undefined);
  }
}

async function runTransform(
  task: Runner,
  rollupOptions: RollupOptions,
  updatedFiles?: string[],
): Promise<OutputResult> {
  const taskRunnerContext = task.context;
  const { logger } = task;
  const { buildContext } = taskRunnerContext;
  let isDistContainingSWCHelpers = false;
  let isDistContainingJSXRuntime = false;

  const { rootDir, userConfig } = buildContext;
  const { buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;
  const config = buildTask.config as TransformTaskConfig;

  const entryDirs = getTransformEntryDirs(rootDir, config.entry as Record<string, string>);

  if (config.sourcemap === 'inline') {
    task.logger.warn('The sourcemap "inline" for transform has not fully supported.');
  }

  const files: OutputFile[] = [];

  if (updatedFiles) {
    for (const updatedFile of updatedFiles) {
      for (const entryDir of entryDirs) {
        if (updatedFile.startsWith(entryDir)) {
          files.push(getFileInfo(updatedFile, entryDir));
          break;
        }
      }
    }
  } else {
    for (const entryDir of entryDirs) {
      files.push(...loadEntryFiles(entryDir, (userConfig?.transform?.excludes || []))
        .map((filePath) => ({
          filePath,
          absolutePath: resolve(entryDir, filePath),
          ext: extname(filePath),
        })));
    }
  }

  const container = await createPluginContainer({
    plugins: rollupOptions.plugins,
    root: rootDir,
    output: config.outputDir,
    logger,
    build: {
      rollupOptions,
    },
  });

  // @ts-expect-error FIXME: config type.
  await container.buildStart(config);
  task.updateProgress(0, files.length);

  for (let i = 0; i < files.length; ++i) {
    const traverseFileStart = performance.now();
    const dest = resolve(config.outputDir, files[i].filePath);
    files[i].dest = dest;

    await fs.ensureDir(dirname(dest));

    const id = (await container.resolveId(files[i].filePath))?.id || files[i].absolutePath;

    const loadResult = await container.load(id);

    let code: string = null;
    let map: SourceMapInput = null;

    // User should use plugins to transform other types of files.
    if (loadResult === null && !INCLUDES_UTF8_FILE_TYPE.test(files[i].ext)) {
      await fs.copyFile(files[i].absolutePath, dest);

      logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
      logger.debug(`Copy File ${files[i].absolutePath} to ${dest}`);

      continue;
    }

    if (loadResult === null) {
      code = await loadSource(files[i].absolutePath);
      // Need to generate .map ?
    } else if (isObject(loadResult)) {
      code = loadResult.code;
      map = loadResult.map as string;
    }

    const transformResult = await container.transform(code, files[i].absolutePath);

    if (transformResult === null ||
      (isObject(transformResult) && transformResult.code === null)
    ) {
      // Do not need to transform the code.
    } else {
      files[i].code = code = transformResult.code;
      files[i].map = map = transformResult.map;

      const destFilename = transformResult?.meta?.filename;

      if (destFilename) {
        files[i].dest = (files[i].dest).replace(basename(files[i].dest), destFilename);
      }
    }

    // IMPROVE: should disable sourcemap generation in the transform step for speed.
    if (map && config.sourcemap !== false) {
      const standardizedMap = typeof map === 'string' ? map : JSON.stringify(map);

      await fs.writeFile(
        files[i].dest,
        `${code}\n //# sourceMappingURL=${transformResult?.meta?.filename}.map`,
        'utf-8',
      );
      await fs.writeFile(`${files[i].dest}.map`, standardizedMap, 'utf-8');
    } else {
      await fs.writeFile(files[i].dest, code, 'utf-8');
    }

    if (!isDistContainingSWCHelpers) {
      isDistContainingSWCHelpers = code?.includes('@swc/helpers');
    }
    if (!isDistContainingJSXRuntime) {
      isDistContainingJSXRuntime = code?.includes('@ice/jsx-runtime');
    }

    logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
    task.updateProgress(1);
  }

  await container.close();

  if (isDistContainingSWCHelpers) {
    // take the semver in package.json for now, the actual used version may not be the same
    const curUsedRange = checkDependencyExists('@swc/helpers', 'https://pkg.ice.work/faq');

    if (curUsedRange && semver.gtr('0.5.13', curUsedRange)) {
      consola.error('`@swc/helpers` 需更新到 `0.5.13` 及以上版本');
      process.exit(1);
    }
  }

  if (isDistContainingJSXRuntime) {
    checkDependencyExists('@ice/jsx-runtime', 'https://pkg.ice.work/faq');
  }

  return {
    outputFiles: files.map((file) => ({ ...file, filename: relative(config.outputDir, file.dest) })),
    taskName,
  };
}

function getFileInfo(filePath: string, rootDir: string) {
  const relativeFilePath = isAbsolute(filePath) ? relative(rootDir, filePath) : filePath;
  return {
    filePath: relativeFilePath,
    absolutePath: resolve(rootDir, relativeFilePath),
    ext: extname(relativeFilePath),
  };
}
