import * as swc from '@swc/core';

import type { Plugin } from 'rollup';
import type { TaskConfig } from '../types';

/**
 * plugin-minify use minimize bundle outputs using swc
 */
const minifyPlugin = (sourcemap: TaskConfig['sourcemap'], minifyOptions: swc.JsMinifyOptions): Plugin => {
  return {
    name: 'ice-pkg:minify',
    renderChunk(code) {
      return swc.minify(code, {
        // Minify amd module will cause an error(`module` reserved Words will be declared in the top level).
        module: true,
        sourceMap: !!sourcemap,
        ...minifyOptions,
      });
    },
  };
};

export default minifyPlugin;
