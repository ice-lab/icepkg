import fs from 'fs-extra';
import { relative } from 'path';
import { performance } from 'perf_hooks';
import { reportSize } from './helpers/reportSize.js';
import runTransform from './loaders/transform.js';
import { buildBundleTasks } from './loaders/bundle.js';
import { createLogger } from './helpers/logger.js';
import { timeFrom } from './utils.js';

import type { PkgContext, TaskLoaderConfig, OutputFile, OutputResult } from './types.js';

export const buildAll = async (taskLoaderConfigs: TaskLoaderConfig[], ctx: PkgContext) => {
  const { rootDir } = ctx;

  const outputResults: OutputResult[] = [];

  for (let c = 0; c < taskLoaderConfigs.length; ++c) {
    const taskLoaderConfig = taskLoaderConfigs[c];

    let outputFiles: OutputFile[] = [];
    if (taskLoaderConfig.type === 'bundle') {
      // const bundleResult = await runBundle(taskLoaderConfig, ctx);
      // outputResults.push(bundleResult);
      // outputFiles = bundleResult.outputFiles;
    } else if (taskLoaderConfig.type === 'transform') {
      const transformResult = await runTransform(taskLoaderConfig, ctx);
      outputResults.push(transformResult);
      outputFiles = transformResult.outputFiles;
    } else {
      // TODO: should throw error type is not defined
    }

    const reportSizeStart = performance.now();
    if (ctx.command === 'build') {
      reportSize(outputFiles.reduce((pre, chunk) => {
        return {
          ...pre,
          [relative(rootDir, chunk.dest)]: chunk.code ?? fs.readFileSync(chunk.dest),
        };
      }, ({} as any)));
    }

    const logger = createLogger('report-size');
    logger.debug(`ReportSize consume ${timeFrom(reportSizeStart)}`);
  }

  return outputResults;
};

