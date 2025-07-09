import { Context, TaskRunnerContext } from '../../types';
import { RslibConfig } from '@rslib/core';
import { merge } from 'es-toolkit/object';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginSass } from '@rsbuild/plugin-sass';
import path from 'path';
import { BUILTIN_EXTERNAL_MAP } from '../shared/external.js';
import { getFilenameConfig } from '../shared/filename.js';

export function getRslibConfig(context: Context, taskRunnerContext: TaskRunnerContext): RslibConfig {
  const { rootDir, commandArgs, pkg } = context;
  const taskConfig = taskRunnerContext.buildTask.config;

  const alias = {};
  Object.keys(taskConfig.alias).forEach((key) => {
    // Add full path for relative path alias
    alias[key] = taskConfig.alias[key].startsWith('.')
      ? path.resolve(rootDir, taskConfig.alias[key])
      : taskConfig.alias[key];
  });

  let rslibConfig: RslibConfig = {
    source: {
      // TODO
      entry: {
        index: './src/index.ts',
      },
      define: taskConfig.define,
    },
    lib: [],
    output: {
      cleanDistPath: false,
    },
    performance: {
      printFileSize: false,
    },
    tools: {
      rspack: {
        stats: false,
      },
    },
    resolve: {
      alias,
    },
    plugins: [pluginLess(), pluginSass()],
  };
  if (taskConfig.type === 'bundle') {
    taskConfig.formats.map((fmt) => {
      const filenameConfig = getFilenameConfig(fmt, taskRunnerContext.mode);
      rslibConfig.lib.push({
        bundle: true,
        format: fmt.module,
        syntax: fmt.target,
        outBase: taskConfig.outputDir,
        umdName: taskConfig.name,
        autoExternal: false,
        output: {
          filename: {
            html: filenameConfig.asset,
            js: filenameConfig.js,
            css: filenameConfig.css,
            font: filenameConfig.asset,
            image: filenameConfig.asset,
            svg: filenameConfig.asset,
            media: filenameConfig.asset,
            assets: filenameConfig.asset,
          },
        },
      });
    });

    let externals: RslibConfig['output']['externals'];
    if (taskConfig.externals === true) {
      externals = [
        ...BUILTIN_EXTERNAL_MAP['builtin:normal'],
        ...BUILTIN_EXTERNAL_MAP['builtin:node'],
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
      ];
    } else if (taskConfig.externals === false) {
      // none
    } else {
      externals = taskConfig.externals;
    }

    merge<RslibConfig, Partial<RslibConfig>>(rslibConfig, {
      output: {
        externals,
        // TODO: maybe error config
        target: taskConfig.browser ? 'web' : 'node',
      },
      resolve: {
        extensions: [
          '.mjs',
          '.js',
          '.json',
          '.node', // plugin-node-resolve default extensions
          '.ts',
          '.jsx',
          '.tsx',
          '.mts',
          '.cjs',
          '.cts', // @ice/pkg default extensions
          ...(taskConfig.extensions || []),
        ],
      },
      performance: {
        bundleAnalyze: commandArgs.analyzer ? {} : undefined,
      },
    });
  } else if (taskConfig.type === 'transform') {
    // not support in transform mode
  } else {
    throw new Error(`Cannot create rslib config of type ${taskConfig.type}`);
  }

  if (taskConfig.modifyRslibConfig) {
    rslibConfig = taskConfig.modifyRslibConfig?.reduce((config, modifier) => modifier(config), rslibConfig);
  }

  return rslibConfig;
}
