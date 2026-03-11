import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'swc-helpers',
    config: {
      entry: './src/entry-mts.ts',
      transform: {
        formats: ['cjs', 'esm'],
      },
      bundle: {
        formats: ['cjs', 'esm', 'umd'],
        externals: [/@swc\/helpers/],
        minify: false,
      },
    },
    snapshot: 'full',
    engine: ['rollup', 'rolldown'],
  },
]);
