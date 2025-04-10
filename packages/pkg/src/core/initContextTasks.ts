import { BuildTask, BundleUserConfig, Context, DeclarationUserConfig, TransformUserConfig, UserConfig } from '../types.js'; // 添加 .js 后缀
import { formatEntry, getTransformDefaultOutputDir } from '../helpers/getTaskIO.js'; // 添加 .js 后缀
import getDefaultDefineValues from '../helpers/getDefaultDefineValues.js'; // 添加 .js 后缀
import { stringifyObject } from '../utils.js'; // 添加 .js 后缀
import { getDefaultBundleSwcConfig, getDefaultTransformSwcConfig } from '../helpers/defaultSwcConfig.js'; // 添加 .js 后缀
import { merge, mergeWith } from 'es-toolkit/object';
import path from 'node:path';

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
  polyfill: 'usage',
  compileDependencies: false,
};

const defaultDeclarationUserConfig = {
  outputMode: 'multi',
} satisfies DeclarationUserConfig;

export function initContextTasks(ctx: Context) {
  const tasks = ctx.getTaskConfig() as BuildTask[];

  for (const buildTask of tasks) {
    initTask(buildTask, ctx);
  }
}

/**
 * @internal export for test
 */
export function initTask(buildTask: BuildTask, { userConfig,
  rootDir,
  command }: Pick<Context, 'userConfig' | 'rootDir' | 'command'>) {
  const {
    config,
    name: taskName,
  } = buildTask;

  config.entry = formatEntry(config.entry ?? userConfig.entry);
  config.alias ??= userConfig.alias;
  // Configure define
  config.define = Object.assign(
    // Note: The define values in bundle mode will be defined (according to the `modes` value)
    // in generating rollup options. But when the command is test, we don't need to get the rollup options.
    // So in test, we assume the mode is 'development'.
    command === 'test' ? getDefaultDefineValues('development') : {},
    stringifyObject(config.define ?? userConfig.define ?? {}),
  );

  config.sourcemap ??= userConfig.sourceMaps ?? command === 'start';
  config.jsxRuntime ??= userConfig.jsxRuntime;

  const expectedMode = command === 'build' ? 'production' : 'development';

  if (config.type === 'bundle') {
    const bundleConfig = userConfig.bundle ?? {};
    config.modes ??= bundleConfig.modes ?? [expectedMode];
    const defaultBundleSwcConfig = getDefaultBundleSwcConfig(config);
    config.swcCompileOptions = typeof config.modifySwcCompileOptions === 'function' ?
      config.modifySwcCompileOptions(defaultBundleSwcConfig) :
      merge(
        defaultBundleSwcConfig,
        config.swcCompileOptions || {},
      );
    // TODO: 判断下这个东西是否真的有用
    // Set outputDir to process.env for CI
    process.env.ICE_PKG_BUNDLE_OUTPUT_DIR = config.outputDir;
    const originMinifyConfig = bundleConfig.minify ?? defaultBundleUserConfig.minify ?? {};
    let {
      jsMinify,
      cssMinify,
    } = config;
    if (typeof originMinifyConfig === 'object') {
      jsMinify ??= getMinifyFunction(originMinifyConfig.js);
      cssMinify ??= getMinifyFunction(originMinifyConfig.css);
    } else {
      jsMinify ??= getMinifyFunction(originMinifyConfig);
      cssMinify ??= getMinifyFunction(originMinifyConfig);
    }

    config.jsMinify = jsMinify;
    config.cssMinify = cssMinify;

    mergeDefaults(config, bundleConfig);
    mergeDefaults(config, defaultBundleUserConfig);
  } else if (config.type === 'transform') {
    config.modes ??= [expectedMode];
    config.outputDir ??= getTransformDefaultOutputDir(rootDir, taskName);
    const defaultTransformSwcConfig = getDefaultTransformSwcConfig(config, expectedMode);
    config.swcCompileOptions = typeof config.modifySwcCompileOptions === 'function' ?
      config.modifySwcCompileOptions(defaultTransformSwcConfig) :
      merge(
        defaultTransformSwcConfig,
        config.swcCompileOptions || {},
      );
  } else if (config.type === 'declaration') {
    const { declaration: declarationConfig } = userConfig;
    if (declarationConfig === false) {
      throw new Error('Cannot disable declaration when transform formats is not empty.');
    }
    config.outputMode ??= declarationConfig === true ? defaultDeclarationUserConfig.outputMode : declarationConfig.outputMode ?? defaultDeclarationUserConfig.outputMode;
    // 这个 output 仅仅用于生成正确的 .d.ts 的 alias，不做实际输出目录
    config.outputDir = path.resolve(rootDir, config.transformFormats[0]);
    if (config.outputMode === 'unique') {
      config.declarationOutputDirs = [path.resolve(rootDir, 'typings')];
    } else {
      config.declarationOutputDirs = config.transformFormats.map((format) => path.resolve(rootDir, format));
    }
  } else {
    throw new Error('Invalid task type.');
  }

  return buildTask;
}

function getMinifyFunction(minify: boolean | ((mode: string, command: string) => unknown)) {
  switch (typeof minify) {
    case 'boolean':
      return () => minify;
    case 'function':
      return minify;
  }
  return defaultMinifyFunction;
}
