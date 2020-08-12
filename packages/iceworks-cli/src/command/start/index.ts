import log from '../../utils/log';

export default async function start(options) {
  console.log('');
  log.warn('', 'Please use Iceworks VS Code plugins: https://ice.work/docs/iceworks/about');
  console.log('');
  process.exit(-1);
}
