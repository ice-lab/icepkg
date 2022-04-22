import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';
import { reportSize } from '../helpers/reportSize.js';

import type { TaskLoaderConfig, PkgContext } from '../types.js';

export default async (cfg: TaskLoaderConfig, ctx: PkgContext): Promise<boolean> => {
  const { command } = ctx;
  const logger = createLogger(cfg.name);

  const bundleStart = performance.now();

  const rollupOption = cfg.rollupOptions;

  logger.debug('Build start...');
  const bundle = await rollup.rollup(rollupOption);

  const outputs = toArray(rollupOption.output);
  let outputChunks = {};

  for (let o = 0; o < outputs.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await bundle.write(outputs[o]);

    outputChunks = writeResult.output.reduce((pre, chunk) => {
      return {
        ...pre,
        [chunk.fileName]: chunk.type === 'chunk' ? chunk.code : chunk.source,
      };
    }, outputChunks);
  }

  await bundle.close();

  logger.info(`⚡️ Build success in ${timeFrom(bundleStart)}`);

  if (command === 'build') {
    const reportSizeStart = performance.now();
    reportSize(outputChunks);

    logger.debug(`ReportSize consume ${timeFrom(reportSizeStart)}`);
  }


  return true;
};
