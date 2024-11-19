import type { Plugin } from 'rollup';
import { composeTransformer } from '../transformers/compose.js';

export function transformerPlugin(options: Parameters<typeof composeTransformer>[0]): Plugin {
  const transformer = composeTransformer(options)
  return {
    name: 'ice-pkg:transformer',
    async transform(code, id) {
      const result = await transformer(code, id)
      return result
    }
  }
}
