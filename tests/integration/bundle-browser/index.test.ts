import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'default',
    config: {
      transform: { formats: [] },
      bundle: {
        formats: ['esm', 'cjs'],
      },
    },
    // FIXME: for rolldown, resolution is different for rollup, so we need to update it later
    engine: ['rollup', 'rolldown'],
  },
  {
    name: 'enable-browser',
    config: {
      transform: { formats: [] },
      bundle: {
        formats: ['esm', 'cjs'],
        browser: true,
      },
    },
    engine: ['rollup', 'rolldown'],
  },
]);
