import { runProjectTest } from './helper';

runProjectTest('bundle-browser', [
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
