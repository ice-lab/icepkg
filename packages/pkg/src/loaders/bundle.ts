import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { BundleTaskLoaderConfig, OutputFile, OutputResult } from '../types.js';

export default async (cfg: BundleTaskLoaderConfig): Promise<OutputResult> => {
  const logger = createLogger(cfg.name);

  const bundleStart = performance.now();

  const { rollupOptions } = cfg;

  logger.debug('Build start...');
  const bundle = await rollup.rollup(rollupOptions);

  const outputs = toArray(rollupOptions.output);
  const outputFiles: OutputFile[] = [];

  for (let o = 0; o < outputs.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await bundle.write(outputs[o]);

    writeResult.output.forEach((chunk) => {
      outputFiles.push({
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
  }

  await bundle.close();

  logger.info(`⚡️ Build success in ${timeFrom(bundleStart)}`);

  return {
    taskName: cfg.name,
    outputFiles,
    modules: bundle.cache.modules,
  };
};
