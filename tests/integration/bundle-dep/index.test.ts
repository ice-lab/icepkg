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
