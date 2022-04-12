
import runTransform from './loaders/transform.js';
import runBundle from './loaders/bundle.js';

import type { PkgContext, TaskConfig } from './types.js';

export const buildAll = async (cfgArrs: TaskConfig[], ctx: PkgContext) => {
  for (let c = 0; c < cfgArrs.length; ++c) {
    const { type } = cfgArrs[c];

    if (type === 'bundle') {
      await runBundle(cfgArrs[c]);
    }

    if (type === 'transform') {
      await runTransform(cfgArrs[c], ctx);
    }
  }
};
