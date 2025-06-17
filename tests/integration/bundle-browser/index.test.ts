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
  },
]);
