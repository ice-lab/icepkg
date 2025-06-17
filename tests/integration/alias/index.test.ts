import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'default',
    config: 'build.config.default.mts',
  },
]);
