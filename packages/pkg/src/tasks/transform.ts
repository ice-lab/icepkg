import { performance } from 'perf_hooks';
import { isAbsolute, resolve, extname, dirname, relative } from 'path';
import fs from 'fs-extra';
import consola from 'consola';
import { loadEntryFiles, loadSource, INCLUDES_UTF8_FILE_TYPE } from '../helpers/load.js';
import { createPluginContainer } from '../helpers/pluginContainer.js';
import { checkDependencyExists, isObject, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type {
  Context,
  OutputFile,
  OutputResult,
  HandleChange,
  RunTasks,
  TaskRunnerContext,
  TransformTaskConfig,
} from '../types.js';
import type { RollupOptions, SourceMapInput } from 'rollup';
import { getTransformEntryDirs } from '../helpers/getTaskIO.js';

export const watchTransformTasks: RunTasks = async (taskOptionsList, context, watcher) => {
  const handleChangeFunctions: HandleChange[] = [];
  const outputResults: OutputResult[] = [];

  for (const taskOptions of taskOptionsList) {
    const [rollupOptions, taskRunnerContext] = taskOptions;
    const entryDirs = getTransformEntryDirs(
      context.rootDir,
      taskRunnerContext.buildTask.config.entry as Record<string, string>,
    );
    watcher.add(entryDirs);

    let outputResult: OutputResult;
    try {
      outputResult = await runTransform(rollupOptions, taskRunnerContext, context);
    } catch (error) {
      consola.error(error.stack);
    }
    outputResults.push(outputResult);

    handleChangeFunctions.push(async (id, event) => {
      if (event === 'update' || event === 'create') {
        return await runTransform(rollupOptions, taskRunnerContext, context, id);
      }
    });
  }

  const handleChange: HandleChange<OutputResult[]> = async (id, event) => {
    const newOutputResults: OutputResult[] = [];
    for (const handleChangeFunction of handleChangeFunctions) {
      const newOutputResult = await handleChangeFunction(id, event);
      newOutputResults.push(newOutputResult);
    }

    return newOutputResults;
  };

  return {
    handleChange,
    outputResults,
  };
};

export const buildTransformTasks: RunTasks = async (taskOptionsList, context) => {
  const outputResults: OutputResult[] = [];

  for (const taskOptions of taskOptionsList) {
    const [rollupOptions, taskRunnerContext] = taskOptions;
    const outputResult = await runTransform(rollupOptions, taskRunnerContext, context);
    outputResults.push(outputResult);
  }

  return {
    outputResults,
  };
};

async function runTransform(
  rollupOptions: RollupOptions,
  taskRunnerContext: TaskRunnerContext,
  context: Context,
  updatedFile?: string,
): Promise<OutputResult> {
  let isDistContainingSWCHelpers = false;
  let isDistContainingJSXRuntime = false;

  const { rootDir, userConfig } = context;
  const { buildTask, mode } = taskRunnerContext;
  const { name: taskName } = buildTask;
  const config = buildTask.config as TransformTaskConfig;

  const logger = createLogger(`${taskName}-${mode}`);
  const entryDirs = getTransformEntryDirs(rootDir, config.entry as Record<string, string>);

  const files: OutputFile[] = [];

  if (updatedFile) {
    for (const entryDir of entryDirs) {
      if (updatedFile.startsWith(entryDir)) {
        files.push(getFileInfo(updatedFile, entryDir));
        break;
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

  const start = performance.now();

  logger.debug('Transform start...');

  // @ts-expect-error FIXME: config type.
  await container.buildStart(config);

  for (let i = 0; i < files.length; ++i) {
    const traverseFileStart = performance.now();
    const dest = resolve(config.outputDir, files[i].filePath);
    files[i].dest = dest;

    fs.ensureDirSync(dirname(dest));

    const id = (await container.resolveId(files[i].filePath))?.id || files[i].absolutePath;

    const loadResult = await container.load(id);

    let code: string = null;
    let map: SourceMapInput = null;

    // User should use plugins to transform other types of files.
    if (loadResult === null && !INCLUDES_UTF8_FILE_TYPE.test(files[i].ext)) {
      fs.copyFileSync(files[i].absolutePath, dest);

      logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
      logger.debug(`Copy File ${files[i].absolutePath} to ${dest}`);

      continue;
    }

    if (loadResult === null) {
      code = loadSource(files[i].absolutePath);
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

      const finalExtname = transformResult?.meta?.ext;

      // If extname changed
      if (finalExtname) {
        files[i].dest = (files[i].dest).replace(files[i].ext, finalExtname);
      }
    }

    if (map) {
      const standardizedMap = typeof map === 'string' ? map : JSON.stringify(map);

      fs.writeFileSync(
        files[i].dest,
        `${code}\n //# sourceMappingURL=${files[i].dest}.map`,
        'utf-8',
      );
      fs.writeFileSync(`${files[i].dest}.map`, standardizedMap, 'utf-8');
    } else {
      fs.writeFileSync(files[i].dest, code, 'utf-8');
    }

    if (!isDistContainingSWCHelpers) {
      isDistContainingSWCHelpers = code?.includes('@swc/helpers');
    }
    if (!isDistContainingJSXRuntime) {
      isDistContainingJSXRuntime = code?.includes('@ice/jsx-runtime');
    }

    logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
  }

  await container.close();

  logger.info(`✅ ${timeFrom(start)}`);

  if (isDistContainingSWCHelpers) {
    checkDependencyExists('@swc/helpers', 'https://pkg.ice.work/faq');
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
