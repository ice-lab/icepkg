import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'swc-helpers',
    config: 'build.config.swc-helpers.mts',
    snapshot: 'full',
  },
]);
