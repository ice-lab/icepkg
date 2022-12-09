import fs from 'fs-extra';
import { relative } from 'path';
import { performance } from 'perf_hooks';
import { reportSize } from './helpers/reportSize.js';
import runTransform from './loaders/transform.js';
import runBundle from './loaders/bundle.js';
import { createLogger } from './helpers/logger.js';
import { timeFrom } from './utils.js';

import type { PkgContext, TaskLoaderConfig, OutputFile, OutputResult } from './types.js';

export const buildAll = async (cfgArrs: TaskLoaderConfig[], ctx: PkgContext) => {
  const { command, rootDir } = ctx;

  if (command === 'build') {
    // Empty outputDir before run the task.
    const outputDirs = cfgArrs.map((cfg) => cfg.outputDir).filter(Boolean);
    outputDirs.forEach((outputDir) => fs.emptyDirSync(outputDir));
  }

  const outputResults: OutputResult[] = [];
  for (let c = 0; c < cfgArrs.length; ++c) {
    const taskLoaderConfig = cfgArrs[c];

    let outputFiles: OutputFile[] = [];
    if (taskLoaderConfig.type === 'bundle') {
      const bundleResult = await runBundle(taskLoaderConfig);
      outputResults.push(bundleResult);
      outputFiles = bundleResult.outputFiles;
    }

    if (taskLoaderConfig.type === 'transform') {
      outputFiles = await runTransform(taskLoaderConfig, ctx);
      outputResults.push({ outputFiles, taskName: taskLoaderConfig.name });
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

