import {runProjectTest} from "./helper";

runProjectTest('default', [
  {
    name: 'default',
    config: {},
    snapshot: 'structure'
  },
  {
    name: 'bundle',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {}
    }
  },
  {
    name: 'bundle-full',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        formats: ['cjs', 'es2017', 'esm', 'umd']
      }
    }
  },
  {
    name: 'sourcemap-enable',
    snapshot: 'structure',
    config: {
      sourceMaps: true
    }
  }
])
