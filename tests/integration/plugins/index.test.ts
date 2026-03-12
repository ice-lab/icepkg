import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'register-format',
    config: 'build.config.register-format.mts',
    snapshot: 'structure',
  },
  {
    name: 'pkg-scope',
    config: 'build.config.pkg-scope.mts',
  },
  {
    name: 'plugin-scope',
    config: 'build.config.plugin-scope.mts',
    snapshotFolders: ['esm', 'es2017'],
  },
]);
