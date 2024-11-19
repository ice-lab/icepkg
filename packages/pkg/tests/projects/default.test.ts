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
    name: 'bundle-with-full-modes',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        modes: ['development', 'production']
      }
    }
  },
  {
    name: 'bundle-with-dev-mode',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        modes: ['development']
      }
    }
  },
  {
    name: 'bundle-with-empty-mode',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        modes: []
      }
    }
  },
  {
    name: 'sourcemap-enable',
    snapshot: 'structure',
    config: {
      sourceMaps: true
    }
  },
  {
    name: 'sourcemap-inline',
    config: {
      sourceMaps: 'inline'
    }
  },
  {
    name: 'no-declaration',
    snapshot: 'structure',
    config: {
      declaration: false
    }
  },
])
