import type {
  TransformUserConfig,
} from '../types.js';

function getUserConfig() {
  const defaultTransformUserConfig: TransformUserConfig = {
    formats: ['esm', 'es2017'],
  };
  const userConfig = [
    {
      name: 'entry',
      defaultValue: 'src/index',
    },
    {
      name: 'alias',
      defaultValue: {},
    },
    {
      name: 'define',
    },
    // TODO: Modify `sourcemaps` to `sourcemap` and make sure to be compatible with icepkg v1 version.
    {
      name: 'sourceMaps',
    },
    {
      name: 'jsxRuntime',
      defaultValue: 'automatic',
    },
    {
      name: 'generateTypesForJs',
      defaultValue: false,
    },
    {
      name: 'declaration',
      defaultValue: true,
    },
    {
      name: 'transform',
      defaultValue: defaultTransformUserConfig,
    },
    {
      name: 'bundle',
    },
  ];
  return userConfig;
}

export default getUserConfig;
