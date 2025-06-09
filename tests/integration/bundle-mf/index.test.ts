import { runProjectTest } from '../../helpers/run';

runProjectTest(import.meta.url, [
  {
    name: 'mf-build',
    config: 'build.config.mts',
    snapshot: 'structure',
    snapshotFolders: ['dist'],
  },
  {
    name: 'mf-build-custom-dir',
    config: 'build.config.custom-dir.mts',
    snapshot: 'structure',
    snapshotFolders: ['dist'],
  },
]);
