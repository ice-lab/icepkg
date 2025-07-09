import { builtinNodeModules } from './builtinModules.js';

export const BUILTIN_EXTERNAL_MAP: Record<string, string[]> = {
  'builtin:normal': ['core-js', 'regenerator-runtime'],
  'builtin:node': builtinNodeModules,
};
