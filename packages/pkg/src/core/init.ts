import { BuildTask, BundleUserConfig, Context, DeclarationUserConfig } from '../types.js';
import { formatEntry, getTransformDefaultOutputDir } from '../helpers/getTaskIO.js';
import getDefaultDefineValues from '../helpers/getDefaultDefineValues.js';
import { stringifyObject } from '../utils.js';
import { merge, mergeWith, omit } from 'es-toolkit/object';
import path from 'node:path';
import { groupBy } from 'es-toolkit';

const mergeDefaults: typeof merge = (target, source) => {
  return mergeWith(target, source, (targetValue, sourceValue) => {
    return targetValue ?? sourceValue;
  });
};

const defaultMinifyFunction = (mode: string, command: string) => {
  return mode === 'production' && command === 'build';
};

const defaultBundleUserConfig: BundleUserConfig = {
  outputDir: 'dist',
  minify: {
    js: defaultMinifyFunction,
    css: defaultMinifyFunction,
  },
  compileDependencies: false,
};

const defaultDeclarationUserConfig = {
  outputMode: 'multi',
} satisfies DeclarationUserConfig;

export function initContextTasks(ctx: Context) {
  const tasks = ctx.getTaskConfig() as BuildTask[];

  const { declaration: declarationTasks, buildable: buildableTasks } = groupBy(tasks, (task) =>
    task.config.type === 'declaration' ? 'declaration' : 'buildable',
  );

  // 1. init all tasks except declaration
  for (const buildTask of buildableTasks) {
    initTask(buildTask, ctx);
  }

  // 2. init declaration based on transform tasks
  for (const buildTask of declarationTasks ?? []) {
    initDeclarationTask(buildTask, ctx, buildableTasks);
  }
}

type InitTaskOptions = Pick<Context, 'userConfig' | 'rootDir' | 'command'>;

function initSharedTask(buildTask: BuildTask, options: InitTaskOptions) {
  const { userConfig, command } = options;
  const { config } = buildTask;
  const { pkg } = config;

  config.entry = formatEntry(config.entry ?? pkg?.entry ?? userConfig.entry);
  config.alias ??= mergeDefaults({ ...pkg?.alias }, userConfig.alias ?? {});
  // Configure define
  config.define = Object.assign(
    // Note: The define values in bundle mode will be defined (according to the `modes` value)
    // in generating rollup options. But when the command is test, we don't need to get the rollup options.
    // So in test, we assume the mode is 'development'.
    command === 'test' ? getDefaultDefineValues('development') : {},
    stringifyObject(userConfig.define ?? {}),
    stringifyObject(pkg?.define ?? {}),
    stringifyObject(config.define ?? {}),
  );

  config.sourcemap ??= pkg?.sourceMaps ?? userConfig.sourceMaps ?? command === 'start';
  config.jsxRuntime ??= pkg?.jsxRuntime ?? userConfig.jsxRuntime;
}

/**
 * @internal export for test
 */
export function initTask(buildTask: BuildTask, options: InitTaskOptions) {
  const { userConfig, rootDir, command } = options;
  const { config, name: taskName } = buildTask;
  const { pkg } = config;

  initSharedTask(buildTask, options);

  const expectedMode = command === 'build' ? 'production' : 'development';

  if (config.type === 'bundle') {
    const bundleConfig = userConfig.bundle ?? {};
    config.modes ??= bundleConfig.modes ?? [expectedMode];
    // TODO: 判断下这个东西是否真的有用
    // Set outputDir to process.env for CI
    process.env.ICE_PKG_BUNDLE_OUTPUT_DIR = config.outputDir;
    const originMinifyConfig = pkg?.minify ?? bundleConfig.minify ?? defaultBundleUserConfig.minify ?? {};
    let { jsMinify, cssMinify } = config;
    if (typeof originMinifyConfig === 'object') {
      jsMinify ??= getMinifyFunction(originMinifyConfig.js);
      cssMinify ??= getMinifyFunction(originMinifyConfig.css);
    } else {
      jsMinify ??= getMinifyFunction(originMinifyConfig);
      cssMinify ??= getMinifyFunction(originMinifyConfig);
    }

    config.jsMinify = jsMinify;
    config.cssMinify = cssMinify;

    config.outputDir ??= pkg?.outputDir ?? bundleConfig.outputDir ?? defaultBundleUserConfig.outputDir;

    if (pkg) {
      mergeDefaults(config, omit(pkg, ['id', 'pluginInfos', 'id', 'target', 'module', 'declaration', 'outputDir']));
    }
    mergeDefaults(config, bundleConfig);
    mergeDefaults(config, defaultBundleUserConfig);
  } else if (config.type === 'transform') {
    config.modes ??= [expectedMode];
    config.outputDir ??= pkg?.outputDir ?? getTransformDefaultOutputDir(rootDir, taskName, config);
  } else if (config.type === 'declaration') {
    // should run in initDeclarationTask
  } else {
    throw new Error('Invalid task type.');
  }

  return buildTask;
}

/**
 * 需要判断 entry 是否一致，对于不一致的 entry，理论上要生成多个 declaration task
 * @internal export for test
 */
export function initDeclarationTask(buildTask: BuildTask, options: InitTaskOptions, allTasks: BuildTask[]) {
  const { userConfig, rootDir } = options;
  const { config } = buildTask;
  const { declaration: declarationConfig } = userConfig;
  if (config.type !== 'declaration') {
    throw new Error('initDeclarationTask only allow declaration task');
  }
  if (declarationConfig === false) {
    throw new Error('Cannot disable declaration when transform formats is not empty.');
  }
  initSharedTask(buildTask, options);
  config.outputMode ??=
    declarationConfig === true
      ? defaultDeclarationUserConfig.outputMode
      : (declarationConfig?.outputMode ?? defaultDeclarationUserConfig.outputMode);
  const allOutputDirs = allTasks
    .map((v) => {
      return v.config.type === 'transform' ? v.config.outputDir! : '';
    })
    .filter(Boolean);
  // 这个 output 仅仅用于生成正确的 .d.ts 的 alias，不做实际输出目录
  config.outputDir = allOutputDirs[0];
  if (config.outputMode === 'unique') {
    config.declarationOutputDirs = [path.resolve(rootDir, 'typings')];
  } else {
    config.declarationOutputDirs = allOutputDirs;
  }

  return buildTask;
}

function getMinifyFunction<T>(minify?: boolean | ((mode: string, command: string) => T)) {
  switch (typeof minify) {
    case 'boolean':
      return () => minify;
    case 'function':
      return minify;
  }
  return defaultMinifyFunction;
}
