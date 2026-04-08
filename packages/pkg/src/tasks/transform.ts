import { performance } from 'perf_hooks';
import { isAbsolute, resolve, extname, relative, dirname } from 'path';
import fs from 'fs-extra';
import semverGtr from 'semver/ranges/gtr.js';
import { consola } from 'consola';
import { createFilter } from '@rollup/pluginutils';
import { loadEntryFiles } from '../helpers/load.js';
import { checkDependencyExists, createScriptsFilter, timeFrom, toArray, unique } from '../utils.js';
import type { OutputFile, OutputResult, TaskRunnerContext, TransformTaskConfig, WatchChangedFile } from '../types.js';
import { rollup, type ExternalOption, type OutputOptions, type Plugin, type RollupOptions } from 'rollup';
import { getTransformEntryDirs, getTransformEntryRoot } from '../helpers/getTaskIO.js';
import { getRollupOptions } from '../engine/rollup/options.js';
import { toOutputFiles } from '../engine/rollup/output.js';
import { withFilteredRollupWarnings } from '../engine/rollup/warn.js';
import { Runner } from '../helpers/runner.js';

export function createTransformTask(taskRunnerContext: TaskRunnerContext) {
  return new TransformRunner(taskRunnerContext);
}

class TransformRunner extends Runner<OutputResult> {
  private rollupOptions: RollupOptions;
  private cache: {
    allEntryDirs: string[];
    entryRoot: string;
    excludes: string | string[];
    scriptFilter: ReturnType<typeof createScriptsFilter>;
    isEntryFileIncluded: (filePath: string) => boolean;
  };

  constructor(taskRunnerContext: TaskRunnerContext) {
    super(taskRunnerContext);
    const { buildContext, buildTask } = taskRunnerContext;
    const { rootDir } = buildContext;
    const config = buildTask.config as TransformTaskConfig;
    const entry = config.entry as Record<string, string>;
    const allEntryDirs = getTransformEntryDirs(rootDir, entry);
    const entryRoot = config.entryRoot ?? getTransformEntryRoot(rootDir, entry);
    const excludes = config.excludes ?? ['**/__tests__/**'];

    this.cache = {
      allEntryDirs,
      entryRoot,
      excludes,
      scriptFilter: createScriptsFilter(),
      isEntryFileIncluded: createEntryFileIncludeMatcher(excludes),
    };
    this.rollupOptions = getRollupOptions(taskRunnerContext.buildContext, taskRunnerContext);

    if (taskRunnerContext.watcher) {
      taskRunnerContext.watcher.add(this.cache.allEntryDirs);
    }
  }

  override doRun(files?: WatchChangedFile[]): Promise<OutputResult> {
    return runTransform(this, this.rollupOptions, files);
  }

  getCache() {
    return this.cache;
  }
}

interface ResolvedCollectedFile extends CollectedFile {
  dest: string;
  filename: string;
}

interface CollectedFile {
  filePath: string;
  absolutePath: string;
  ext: string;
}

function createEntryFileIncludeMatcher(excludes: string | string[]) {
  const patterns = ['node_modules/**', ...toArray(excludes ?? [])];
  const filter = createFilter(undefined, patterns);
  return (filePath: string) => {
    const normalizedFilePath = filePath.split('\\').join('/');
    return filter(normalizedFilePath);
  };
}

async function runTransform(
  task: TransformRunner,
  rollupOptions: RollupOptions,
  changedFiles?: WatchChangedFile[],
): Promise<OutputResult> {
  const taskRunnerContext = task.context;
  const { logger } = task;
  let isDistContainingSWCHelpers = false;
  let isDistContainingJSXRuntime = false;

  const { buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;
  const config = buildTask.config as TransformTaskConfig;
  const { allEntryDirs, entryRoot, excludes, scriptFilter, isEntryFileIncluded } = task.getCache();

  const entryDirs = getTargetEntryDirs(allEntryDirs, changedFiles);

  if (changedFiles?.length) {
    logger.debug(
      `Rebuild transform task (${taskName}) for ${changedFiles.length} changed files and ${entryDirs.length} entry dirs.`,
    );
  }

  const files = shouldFullRebuild(changedFiles)
    ? collectTransformFiles(entryDirs, excludes, entryRoot)
    : collectChangedTransformFiles(entryDirs, changedFiles ?? [], entryRoot, isEntryFileIncluded);
  const resolvedFiles = files.map<ResolvedCollectedFile>((file) => {
    const dest = resolve(config.outputDir!, file.filePath);
    return {
      ...file,
      dest,
      filename: relative(config.outputDir!, dest),
    };
  });

  await removeDeletedOutputs(config, entryDirs, changedFiles, entryRoot);

  const rollupInputs = unique(files.filter((file) => scriptFilter(file.absolutePath)).map((file) => file.absolutePath));
  const emittedFileSet = new Set<string>();
  const outputFiles: OutputFile[] = [];

  task.updateProgress(0, resolvedFiles.length);

  if (rollupInputs.length) {
    const buildStart = performance.now();
    const bundle = await rollup({
      ...withFilteredRollupWarnings(rollupOptions),
      input: rollupInputs,
      external: rollupOptions.external ?? defaultTransformExternal,
      plugins: [transformRelativeExternalPlugin(), ...((rollupOptions.plugins as Plugin[]) ?? [])],
    });

    const output = await bundle.write(getTransformOutputOptions(config, entryRoot));
    await bundle.close();

    for (const item of output.output) {
      emittedFileSet.add(resolve(config.outputDir!, item.fileName));
    }

    outputFiles.push(...toOutputFiles(output.output, config.outputDir!));

    for (const item of output.output) {
      if (item.type !== 'chunk') {
        continue;
      }

      if (!isDistContainingSWCHelpers) {
        isDistContainingSWCHelpers = item.code.includes('@swc/helpers');
      }
      if (!isDistContainingJSXRuntime) {
        isDistContainingJSXRuntime = item.code.includes('@ice/jsx-runtime');
      }
    }

    logger.debug(`Rollup preserveModules (${rollupInputs.length} inputs)`, timeFrom(buildStart));
  }

  for (const file of resolvedFiles) {
    const traverseFileStart = performance.now();
    if (scriptFilter(file.absolutePath) || emittedFileSet.has(file.dest)) {
      task.updateProgress(1);
      continue;
    }

    await fs.ensureDir(dirname(file.dest));
    await fs.copyFile(file.absolutePath, file.dest);
    emittedFileSet.add(file.dest);
    outputFiles.push(file);

    logger.debug(`Copy file ${file.absolutePath} to ${file.dest}`);
    logger.debug(`Transform file ${file.absolutePath}`, timeFrom(traverseFileStart));
    task.updateProgress(1);
  }

  if (isDistContainingSWCHelpers) {
    // take the semver in package.json for now, the actual used version may not be the same
    const curUsedRange = checkDependencyExists('@swc/helpers', 'https://pkg.ice.work/faq');

    if (
      curUsedRange &&
      !curUsedRange.startsWith('workspace:') &&
      !curUsedRange.startsWith('catalog:') &&
      semverGtr('0.5.17', curUsedRange)
    ) {
      consola.error('`@swc/helpers` 需更新到 `0.5.17` 及以上版本');
    }
  }

  if (isDistContainingJSXRuntime) {
    checkDependencyExists('@ice/jsx-runtime', 'https://pkg.ice.work/faq');
  }

  return {
    outputFiles,
    taskName,
  };
}

function collectTransformFiles(entryDirs: string[], excludes: string | string[], entryRoot: string): CollectedFile[] {
  const files: CollectedFile[] = [];
  const visited = new Set<string>();

  for (const entryDir of entryDirs) {
    const matchedFiles = loadEntryFiles(entryDir, excludes);
    for (const matchedFile of matchedFiles) {
      const file = getFileInfo(resolve(entryDir, matchedFile), entryRoot);
      if (visited.has(file.absolutePath)) {
        continue;
      }
      visited.add(file.absolutePath);
      files.push(file);
    }
  }

  return files;
}

export function collectChangedTransformFiles(
  entryDirs: string[],
  changedFiles: WatchChangedFile[],
  entryRoot: string,
  isEntryFileIncluded: (filePath: string) => boolean,
): CollectedFile[] {
  const files: CollectedFile[] = [];
  const visited = new Set<string>();

  for (const changedFile of changedFiles) {
    if (changedFile.event === 'delete') {
      continue;
    }

    const absolutePath = resolve(changedFile.path);
    const entryDir = entryDirs.find((candidate) => isPathInDir(absolutePath, candidate));

    if (!entryDir) {
      continue;
    }

    const entryRelativePath = relative(entryDir, absolutePath);
    const file = getFileInfo(absolutePath, entryRoot);

    if (!isEntryFileIncluded(entryRelativePath) || visited.has(file.absolutePath)) {
      continue;
    }

    visited.add(file.absolutePath);
    files.push(file);
  }

  return files;
}

function shouldFullRebuild(changedFiles?: WatchChangedFile[]) {
  return !changedFiles?.length || changedFiles.some((file) => file.event === 'delete');
}

export function getTargetEntryDirs(entryDirs: string[], changedFiles?: WatchChangedFile[]) {
  if (!changedFiles?.length) {
    return entryDirs;
  }

  const changedPaths = changedFiles.map((file) => resolve(file.path));
  const targetEntryDirs = entryDirs.filter((entryDir) =>
    changedPaths.some((changedPath) => isPathInDir(changedPath, entryDir)),
  );

  return targetEntryDirs.length ? targetEntryDirs : entryDirs;
}

async function removeDeletedOutputs(
  config: TransformTaskConfig,
  entryDirs: string[],
  changedFiles?: WatchChangedFile[],
  entryRoot?: string,
) {
  if (!changedFiles?.length) {
    return;
  }

  const deletedFiles = changedFiles.filter((file) => file.event === 'delete');

  await Promise.all(
    deletedFiles.map(async (file) => {
      const absolutePath = resolve(file.path);
      const entryDir = entryDirs.find((candidate) => isPathInDir(absolutePath, candidate));

      if (!entryDir) {
        return;
      }

      const fileInfo = getFileInfo(absolutePath, entryRoot ?? entryDir);
      const directDest = resolve(config.outputDir!, fileInfo.filePath);
      const emittedDest = resolve(config.outputDir!, getEmittedFileName(fileInfo.filePath));

      await fs.remove(directDest);
      if (emittedDest !== directDest) {
        await fs.remove(emittedDest);
      }

      if (config.sourcemap !== false) {
        await fs.remove(`${emittedDest}.map`);
      }
    }),
  );
}

function isPathInDir(filePath: string, dirPath: string) {
  const normalizedFilePath = resolve(filePath);
  const normalizedDirPath = resolve(dirPath);
  return normalizedFilePath === normalizedDirPath || normalizedFilePath.startsWith(`${normalizedDirPath}/`);
}

function getTransformOutputOptions(config: TransformTaskConfig, entryRoot: string): OutputOptions {
  return {
    dir: config.outputDir,
    format: config.format.module === 'cjs' ? 'cjs' : 'es',
    sourcemap: config.sourcemap,
    preserveModules: true,
    preserveModulesRoot: entryRoot,
    exports: 'auto',
    entryFileNames: (chunkInfo) => getChunkFileName(chunkInfo.facadeModuleId, entryRoot),
    chunkFileNames: (chunkInfo) => getChunkFileName(chunkInfo.facadeModuleId, entryRoot),
  };
}

function getChunkFileName(facadeModuleId: string | null, entryDir: string) {
  if (!facadeModuleId) {
    return '[name].js';
  }

  const relativePath = relative(entryDir, facadeModuleId);
  return getEmittedFileName(relativePath);
}

function getEmittedFileName(relativePath: string) {
  const ext = extname(relativePath);
  const destExt = ext === '.cts' || ext === '.cjs' ? '.cjs' : ext === '.mts' || ext === '.mjs' ? '.mjs' : '.js';
  return relativePath.replace(new RegExp(`${ext}$`), destExt);
}

const defaultTransformExternal: ExternalOption = (id) => {
  return !id.startsWith('.') && !isAbsolute(id) && !id.startsWith('\0');
};

function transformRelativeExternalPlugin(): Plugin {
  return {
    name: 'ice-pkg:transform-relative-external',
    resolveId(source, importer) {
      if (importer && source.startsWith('.')) {
        return {
          id: source,
          external: true,
        };
      }
      return null;
    },
  };
}

function getFileInfo(filePath: string, rootDir: string): CollectedFile {
  const absolutePath = isAbsolute(filePath) ? filePath : resolve(rootDir, filePath);
  const relativeFilePath = relative(rootDir, absolutePath);
  return {
    filePath: relativeFilePath,
    absolutePath,
    ext: extname(relativeFilePath),
  };
}
