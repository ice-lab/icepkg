import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'rollup',
    config: {
      declaration: false,
      sourceMaps: false,
      pkgs: [
        // Transform 三种语法目标
        { module: 'esm', target: 'es5', outputDir: 'esm' },
        'es2017',
        'es2022',
        // Bundle 三种语法目标
        { module: 'esm', target: 'es5', bundle: true, outputDir: 'dist/es5' },
        { module: 'esm', target: 'es2017', bundle: true, outputDir: 'dist/es2017' },
        { module: 'esm', target: 'es2022', bundle: true, outputDir: 'dist/es2022' },
      ],
    },
    snapshot: 'full',
    snapshotFolders: ['esm', 'es2017', 'es2022', 'dist'],
  },
  {
    name: 'rolldown',
    config: {
      declaration: false,
      sourceMaps: false,
      pkgs: [
        { module: 'esm', target: 'es5', bundle: true, outputDir: 'dist/es5', engine: 'rolldown' },
        { module: 'esm', target: 'es2017', bundle: true, outputDir: 'dist/es2017', engine: 'rolldown' },
        { module: 'esm', target: 'es2022', bundle: true, outputDir: 'dist/es2022', engine: 'rolldown' },
      ],
    },
    snapshot: 'full',
    snapshotFolders: ['dist'],
  },
]);
