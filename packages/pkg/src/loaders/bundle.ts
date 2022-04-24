import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { TaskLoaderConfig, OutputFile } from '../types.js';

export default async (cfg: TaskLoaderConfig): Promise<OutputFile[]> => {
  const logger = createLogger(cfg.name);

  const bundleStart = performance.now();

  const rollupOption = cfg.rollupOptions;

  logger.debug('Build start...');
  const bundle = await rollup.rollup(rollupOption);

  const outputs = toArray(rollupOption.output);
  const outputChunks: OutputFile[] = [];

  for (let o = 0; o < outputs.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await bundle.write(outputs[o]);

    writeResult.output.forEach((chunk) => {
      outputChunks.push({
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
  }

  await bundle.close();

  logger.info(`⚡️ Build success in ${timeFrom(bundleStart)}`);

  return outputChunks;
};
