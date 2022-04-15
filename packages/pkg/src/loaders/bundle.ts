import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { TaskConfig } from '../types.js';

export default async (cfg: TaskConfig): Promise<boolean> => {
  const logger = createLogger('bundle');

  const bundleStart = performance.now();

  const rollupOption = cfg.rollupOptions;

  logger.info('Build start...');
  const bundle = await rollup.rollup(rollupOption);

  const outputs = toArray(rollupOption.output);

  for (let o = 0; o < outputs.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    await bundle.write(outputs[o]);
  }

  await bundle.close();

  logger.info(`⚡️ Build success in ${(performance.now() - bundleStart).toFixed(2)}ms`);

  return true;
};
