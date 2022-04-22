
import runTransform from './loaders/transform.js';
import runBundle from './loaders/bundle.js';

import type { PkgContext, TaskLoaderConfig } from './types.js';

export const buildAll = async (cfgArrs: TaskLoaderConfig[], ctx: PkgContext) => {
  for (let c = 0; c < cfgArrs.length; ++c) {
    const { type } = cfgArrs[c];

    if (type === 'bundle') {
      await runBundle(cfgArrs[c], ctx);
    }

    if (type === 'transform') {
      await runTransform(cfgArrs[c], ctx);
    }
  }
};
