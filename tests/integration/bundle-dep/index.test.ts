import { runProjectTest, ProjectTestUserConfig } from '../../helpers/run';

const tests: ProjectTestUserConfig[] = [
  {
    name: 'default-venders',
    config: {
      entry: './src/normal.ts',
      transform: {
        formats: [],
      },
      bundle: {
        formats: ['cjs', 'umd', 'esm'],
      },
    },
  },
  {
    name: 'default-no-venders',
    config: {
      entry: './src/normal.ts',
      transform: {
        formats: [],
      },
      bundle: {
        formats: ['cjs', 'umd', 'esm'],
        codeSplitting: false,
      },
    },
  },
  {
    name: 'default-no-venders-pkg',
    config: {
      pkgs: [
        {
          entry: { 'no-venders': './src/normal.ts' },
          module: 'esm',
          target: 'es5',
          bundle: true,
          codeSplitting: false,
        },
        {
          entry: { 'with-venders': './src/normal.ts' },
          module: 'esm',
          target: 'es2017',
          bundle: true,
        },
      ],
    },
  },
  // should inlineDynamicImport for umd
  {
    name: 'dynamic-import',
    config: {
      entry: './src/dynamic-import.ts',
      bundle: {
        // rollup has error when using umd and cjs in same instance
        // https://github.com/rollup/rollup/issues/6296
        formats: ['umd'],
      },
    },
    engine: ['rollup', 'rolldown'],
  },
  {
    name: 'dynamic-import-pkg',
    config: {
      entry: './src/dynamic-import.ts',
      pkgs: [
        {
          module: 'esm',
          target: 'es5',
          bundle: true,
        },
        {
          module: 'cjs',
          target: 'es5',
          bundle: true,
        },
        {
          module: 'umd',
          target: 'es5',
          bundle: true,
        },
      ],
    },
    engine: ['rollup', 'rolldown'],
  },
];

runProjectTest(
  import.meta.url,
  tests.map<ProjectTestUserConfig>((t) => {
    return {
      ...t,
      snapshot: t.snapshot ?? 'structure',
      snapshotFolders: t.snapshotFolders ?? ['dist'],
    };
  }),
);
