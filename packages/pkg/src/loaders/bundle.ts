import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { BundleTaskLoaderConfig, OutputFile, OutputResult } from '../types.js';

export default async (cfg: BundleTaskLoaderConfig): Promise<OutputResult> => {
  const { rollupOptions, name } = cfg;

  const logger = createLogger(name);

  const bundleStart = performance.now();

  logger.debug('Build start...');

  const bundle = await rollup.rollup(rollupOptions);

  const rollupOutputOptions = toArray(rollupOptions.output);
  const outputFiles: OutputFile[] = [];
  const outputs: Array<rollup.RollupOutput['output']> = [];
  for (let o = 0; o < rollupOutputOptions.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await bundle.write(rollupOutputOptions[o]);

    writeResult.output.forEach((chunk) => {
      outputFiles.push({
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
    outputs.push(writeResult.output);
  }

  await bundle.close();

  logger.info(`⚡️ Build success in ${timeFrom(bundleStart)}`);

  return {
    taskName: cfg.name,
    outputFiles,
    outputs,
    modules: bundle.cache.modules,
  };
};
