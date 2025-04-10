import { runProjectTest } from './helper';

runProjectTest('plugins', [{
  name: 'custom-format',
  config: 'build.config.custom-format.mts',
  snapshot: 'structure'
}])
