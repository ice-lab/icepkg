
import fs from 'fs-extra';
import { performance } from 'perf_hooks';
import { reportSize } from './helpers/reportSize.js';
import runTransform from './loaders/transform.js';
import runBundle from './loaders/bundle.js';
import { createLogger } from './helpers/logger.js';
import { timeFrom } from './utils.js';

import type { PkgContext, TaskLoaderConfig, OutputFile, OutputResult } from './types.js';

export const buildAll = async (cfgArrs: TaskLoaderConfig[], ctx: PkgContext) => {
  let outputResults: Array<OutputResult> = [];
  for (let c = 0; c < cfgArrs.length; ++c) {
    const { type, name } = cfgArrs[c];

    let outputFiles: OutputFile[] = [];
    if (type === 'bundle') {
      const bundleResult = await runBundle(cfgArrs[c]);
      outputResults.push(bundleResult);
      outputFiles = bundleResult.outputFiles;
    }

    if (type === 'transform') {
      outputFiles = await runTransform(cfgArrs[c], ctx);
      outputResults.push({ outputFiles, taskName: name });
    }

    const reportSizeStart = performance.now();
    if (ctx.command === 'build') {
      reportSize(outputFiles.reduce((pre, chunk) => {
        return {
          ...pre,
          [chunk.filename]: chunk.code ?? fs.readFileSync(chunk.dest),
        };
      }, ({} as any)));
    }

    const logger = createLogger('report-size');
    logger.debug(`ReportSize consume ${timeFrom(reportSizeStart)}`);
  }
  return outputResults;
};

