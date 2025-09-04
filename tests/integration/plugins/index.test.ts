import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'custom-format',
    config: 'build.config.custom-format.mts',
    snapshot: 'structure',
  },
  {
    name: 'pkg-scope',
    config: 'build.config.pkg-scope.mts',
  },
]);
