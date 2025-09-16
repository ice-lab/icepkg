import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'default',
    config: {},
    snapshot: 'structure',
  },
  {
    name: 'bundle',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {},
    },
  },
  {
    name: 'bundle-full',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        formats: ['cjs', 'es2017', 'esm', 'umd'],
      },
    },
  },
  {
    name: 'bundle-with-full-modes',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        modes: ['development', 'production'],
      },
    },
  },
  {
    name: 'bundle-with-dev-mode',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        modes: ['development'],
      },
    },
  },
  {
    name: 'bundle-with-empty-mode',
    snapshot: 'structure',
    config: {
      transform: { formats: [] },
      bundle: {
        modes: [],
      },
    },
  },
  {
    name: 'sourcemap-enable',
    snapshot: 'structure',
    config: {
      sourceMaps: true,
    },
  },
  {
    name: 'no-declaration',
    snapshot: 'structure',
    config: {
      declaration: false,
    },
  },
  {
    name: 'pkg-compat-transform',
    snapshot: 'structure',
    config: {
      pkgs: ['esm', 'es2017', 'cjs'],
    },
  },
  {
    name: 'pkg-compat-bundle',
    snapshot: 'structure',
    config: {
      pkgs: ['!esm', '!es2017', '!cjs'],
    },
  },
  {
    name: 'pkg-compat-bundle-2',
    snapshot: 'structure',
    config: {
      pkgs: ['!es2017', '!umd'],
    },
  },
  {
    name: 'pkg-config',
    snapshot: 'structure',
    config: {
      pkgs: [
        {
          module: 'esm',
          target: 'es2017',
        },
      ],
    },
  },
  {
    name: 'pkg-config-disabled',
    snapshot: 'structure',
    config: {
      pkgs: [
        {
          module: 'esm',
          target: 'es2017',
        },
        {
          module: 'cjs',
          target: 'es2017',
          disable: true,
        },
      ],
    },
  },
]);
