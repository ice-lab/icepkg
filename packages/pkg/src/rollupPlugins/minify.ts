import * as swc from '@swc/core';

import type { JsMinifyOptions } from '@swc/core';
import type { RollupPluginFn, TaskConfig } from '../types.js';

export interface MinifyPluginOption {
  sourcemap: TaskConfig['sourcemap'];
  minifyOptions?: JsMinifyOptions;
}

/**
 * plugin-minify use minimize bundle outputs using swc
 */
const minifyPlugin: RollupPluginFn<MinifyPluginOption> = ({
  minifyOptions = {
    compress: {
      unused: false,
    },
  },
  sourcemap,
}) => {
  return {
    name: 'ice-pkg:minify',

    renderChunk(_) {
      return swc.minifySync(_, {
        ...minifyOptions,
        // Rollup will determine whether inlined sourcemap or not
        sourceMap: !!sourcemap,
      });
    },
  };
};

export default minifyPlugin;
