import { runProjectTest } from '../../helpers/run';

const externals = [/^react/, /^@swc\/helpers/, /^@ice\/jsx-runtime/];

runProjectTest(import.meta.url, [
  {
    name: 'default',
    config: {
      transform: {
        formats: ['esm'],
      },
      bundle: {
        formats: ['esm'],
        externals,
      },
    },
  },
  {
    name: 'pkg',
    config: {
      pkgs: [
        {
          module: 'esm',
        },
        {
          module: 'esm',
          bundle: true,
        },
      ],
      bundle: {
        externals,
      },
    },
  },
  {
    name: 'rolldown',
    snapshotFolders: ['dist'],
    config: {
      pkgs: [
        {
          bundle: true,
          engine: 'rolldown',
        },
      ],
      bundle: {
        externals,
      },
    },
  },
]);
