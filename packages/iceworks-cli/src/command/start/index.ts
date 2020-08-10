import log from '../../utils/log';

export default async function start(options) {
  log.warn('', 'Please use Iceworks VS Code plugins: https://ice.work/docs/iceworks/about');
  process.exit(-1);
}
