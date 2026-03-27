import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'inline-helpers',
    config: {
      helpers: 'inline',
      transform: {
        formats: ['esm'],
      },
      bundle: {
        formats: ['esm'],
      },
    },
    snapshot: 'full',
  },
  {
    name: 'external-helpers',
    config: {
      helpers: 'external',
      transform: {
        formats: ['esm'],
      },
      bundle: {
        formats: ['esm'],
      },
    },
    snapshot: 'full',
  },
  {
    name: 'pkg-inline-helpers',
    config: {
      pkgs: [
        {
          module: 'esm',
          helpers: 'inline',
        },
      ],
    },
    snapshot: 'full',
  },
]);
