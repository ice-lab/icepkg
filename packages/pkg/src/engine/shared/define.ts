import { NodeEnvMode } from '../../types.js';

export default function getDefaultDefineValues(mode: NodeEnvMode) {
  return {
    __DEV__: JSON.stringify(mode !== 'production'),
    'process.env.NODE_ENV': JSON.stringify(mode),
    'import.meta.vitest': 'undefined',
  };
}
