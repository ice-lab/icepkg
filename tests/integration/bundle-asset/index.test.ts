import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'default',
    config: {
      entry: './src/index.ts',
      transform: {
        formats: [],
      },
      bundle: {
        formats: ['esm'],
      },
    },
    engine: ['rollup', 'rolldown'],
  },
]);
