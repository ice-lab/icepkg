import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { TaskLoaderConfig, OutputFile, OutputResult } from '../types.js';

export default async (cfg: TaskLoaderConfig): Promise<OutputResult> => {
  const logger = createLogger(cfg.name);

  const bundleStart = performance.now();

  const rollupOption = cfg.rollupOptions;

  logger.debug('Build start...');
  const bundle = await rollup.rollup(rollupOption);

  const outputs = toArray(rollupOption.output);
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
  }
};
