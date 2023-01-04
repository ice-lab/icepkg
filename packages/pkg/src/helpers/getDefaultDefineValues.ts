import { NodeEnvMode } from '../types';

export default function getDefaultDefineValues(mode: NodeEnvMode) {
  return {
    __DEV__: JSON.stringify(mode === 'development'),
    'process.env.NODE_ENV': JSON.stringify(mode),
  };
}
