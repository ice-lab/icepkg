import { Context, TaskRunnerContext } from '../../types';
import { RslibConfig, Rspack } from '@rslib/core';
import { merge } from 'es-toolkit/object';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginSass } from '@rsbuild/plugin-sass';
import path from 'path';
import { BUILTIN_EXTERNAL_MAP } from '../shared/external.js';
import { getFilenameConfig } from '../shared/filename.js';

export function getRslibConfig(context: Context, taskRunnerContext: TaskRunnerContext): RslibConfig {
  const { rootDir, commandArgs, pkg } = context;
  const taskConfig = taskRunnerContext.buildTask.config;

  const alias: Record<string, string> = {};
  if (taskConfig.alias) {
    const taskAlias = taskConfig.alias as Record<string, string>;
    for (const key of Object.keys(taskConfig.alias)) {
      const val = taskAlias[key];
      // Add full path for relative path alias
      alias[key] = val.startsWith('.') ? path.resolve(rootDir, val) : val;
    }
  }

  let rslibConfig: RslibConfig = {
    source: {
      entry:
        typeof taskConfig.entry === 'string' || Array.isArray(taskConfig.entry)
          ? { index: taskConfig.entry }
          : taskConfig.entry,
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
        umdName: taskConfig.name,
        autoExternal: false,
        output: {
          distPath: {
            root: taskConfig.outputDir,
          },
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
          // mf is not set target
          target: fmt.module === 'mf' ? undefined : taskConfig.browser ? 'web' : 'node',
        },
      });
    });

    let externals: Rspack.Externals | undefined;
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

  if (Array.isArray(taskConfig.modifyRslibConfig)) {
    for (const modifier of taskConfig.modifyRslibConfig) {
      if (typeof modifier === 'function') {
        // allow modifier to mutate or return new config
        const modified = modifier(rslibConfig);
        if (modified) rslibConfig = modified;
      }
    }
  }

  return rslibConfig;
}
