import { isAbsolute, resolve, extname, dirname, relative, basename } from 'path';
import fs from 'fs-extra';
import semver from 'semver';
import { loadEntryFiles, loadSource, INCLUDES_UTF8_FILE_TYPE } from '../helpers/load.js';
import { concurrentPromiseAll, getCompiledFileExt, isObject } from '../utils.js';
import type {
  OutputFile,
  OutputResult,
  TaskRunnerContext,
  TransformTaskConfig,
  WatchChangedFile,
} from '../types.js';
import type { SourceMapInput } from 'rollup';
import { getTransformEntryDirs } from '../helpers/getTaskIO.js';
import { Runner } from '../helpers/runner.js';
import { getExistedChangedFilesPath } from '../helpers/watcher.js';
import { CompileTransformer, composeTransformer } from '../transformers/compose.js';
import { checkDependencyExists } from '../helpers/deps.js';

export function createTransformTask(taskRunnerContext: TaskRunnerContext) {
  return new TransformRunner(taskRunnerContext);
}

class TransformRunner extends Runner<OutputResult> {
  private transformer: CompileTransformer;
  entryDirs: string[]

  constructor(taskRunnerContext: TaskRunnerContext) {
    super(taskRunnerContext);
    const { buildTask: { config }, buildContext} = taskRunnerContext
    this.transformer = composeTransformer({
      transformers: [],
      alias: config.alias,
      rootDir: buildContext.rootDir,
      extraSwcOptions: config.swcCompileOptions,
      jsxRuntime: config.jsxRuntime,
      babelPlugins: config.babelPlugins,
      babelOptions: {
        jsxRuntime: config.jsxRuntime,
        pragma: config.swcCompileOptions?.jsc?.transform?.react?.pragma,
        pragmaFrag: config.swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
      },
      modifyBabelOptions: config.modifyBabelOptions,
    })
    this.entryDirs = getTransformEntryDirs(
      buildContext.rootDir,
      config.entry as Record<string, string>,
    )
    if (taskRunnerContext.watcher) {
      taskRunnerContext.watcher.add(this.entryDirs);
    }
  }

  override doRun(files?: WatchChangedFile[]): Promise<OutputResult> {
    return runTransform(this, this.transformer, files ? getExistedChangedFilesPath(files) : undefined);
  }
}

async function runTransform(
  task: TransformRunner,
  transformer: CompileTransformer,
  updatedFiles?: string[],
): Promise<OutputResult> {
  const taskRunnerContext = task.context;
  const { logger, entryDirs } = task;
  const { buildContext } = taskRunnerContext;
  let isDistContainingSWCHelpers = false;
  let isDistContainingJSXRuntime = false;

  const { userConfig } = buildContext;
  const { buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;
  const config = buildTask.config as TransformTaskConfig;

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

  task.updateProgress(0, files.length);

  await concurrentPromiseAll(files.map(file => async () => {
    const dest = resolve(config.outputDir, destFile(file.filePath));
    file.dest = dest;

    await fs.ensureDir(dirname(dest));

    const id = file.absolutePath;

    let code: string = null;
    let map: SourceMapInput = null;

    // User should use plugins to transform other types of files.
    if (!INCLUDES_UTF8_FILE_TYPE.test(file.ext)) {
      await fs.copyFile(file.absolutePath, dest);

      // logger.debug(`Transform file ${file.absolutePath}`, timeFrom(traverseFileStart));
      logger.debug(`Copy File ${file.absolutePath} to ${dest}`);

      return;
    }

    file.code = code = await loadSource(file.absolutePath);

    const transformResult = await transformer(code, id);

    if (transformResult === null ||
      (isObject(transformResult) && transformResult.code === null)
    ) {
      // Do not need to transform the code.
    } else {
      file.code = code = transformResult.code;
      file.map = map = transformResult.map;
    }

    // IMPROVE: should disable sourcemap generation in the transform step for speed.
    if (map && config.sourcemap !== false) {
      const standardizedMap = typeof map === 'string' ? map : JSON.stringify(map);

      if (config.sourcemap === 'inline') {
        await fs.writeFile(
          file.dest,
          `${code}\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(standardizedMap).toString('base64')}`,
          'utf-8',
        )
      } else {
        await Promise.all([
          fs.writeFile(
            file.dest,
            `${code}\n //# sourceMappingURL=${basename(file.dest)}.map`,
            'utf-8',
          ),
          fs.writeFile(`${file.dest}.map`, standardizedMap, 'utf-8'),
        ])
      }
    } else {
      await fs.writeFile(file.dest, code, 'utf-8');
    }

    if (!isDistContainingSWCHelpers) {
      isDistContainingSWCHelpers = code?.includes('@swc/helpers');
    }
    if (!isDistContainingJSXRuntime) {
      isDistContainingJSXRuntime = code?.includes('@ice/jsx-runtime');
    }

    task.updateProgress(1);
  }))

  if (isDistContainingSWCHelpers) {
    // take the semver in package.json for now, the actual used version may not be the same
    const curUsedRange = checkDependencyExists('@swc/helpers', 'https://pkg.ice.work/faq');

    if (curUsedRange && semver.gtr('0.5.13', curUsedRange)) {
      logger.error('`@swc/helpers` 需更新到 `0.5.13` 及以上版本');
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

function destFile(filePath: string): string {
  const oldExt = extname(filePath)
  const newExt = getCompiledFileExt(oldExt)
  return `${filePath.slice(0, -oldExt.length)}${newExt}`
}
