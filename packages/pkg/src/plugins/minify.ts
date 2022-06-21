import * as swc from '@swc/core';

import type { JsMinifyOptions } from '@swc/core';
import type { RollupPluginFn } from '../types.js';

export interface MinifyPluginOption {
  minifyOption: true | JsMinifyOptions;
  sourceMaps: boolean | 'inline';
}

/**
 * plugin-minify use minmize bundle ouputs using swc
 */
const minifyPlugin: RollupPluginFn<MinifyPluginOption> = ({
  minifyOption,
  sourceMaps,
}) => {
  return {
    name: 'ice-pkg:minify',

    renderChunk(_) {
      return swc.minifySync(_, {
        ...(typeof minifyOption === 'boolean' ? {
          compress: {
            unused: false,
          },
        } : minifyOption),
        // Rollup will determine whether inlined sourcemap or not
        sourceMap: !!sourceMaps,
      });
    },
  };
};

export default minifyPlugin;
