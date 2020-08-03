const debug = require('debug')('build-plugin-component-screenshot');
const detect = require('detect-port');
const fse = require('fs-extra');
const screenshotWithLocalServer = require('./screenshot');

const DEFAULT_PORT = 8100;

module.exports = (
  { context, onHook, log },
  pluginOptions = {},
) => {
  const { rootDir, pkg } = context;
  const { cloud = false } = pluginOptions;
  onHook('after.build.compile', async () => {
    debug('cloud', cloud);
    // cloud build support
    if(!cloud && process.env.BUILD_ENV === 'cloud') {
      log.warn('current environment not support screenshot');
      return;
    }
    log.info('generate demo snapshot ...');
    const demoPath = `${rootDir}/demo`;
    const serverPath = `${rootDir}/build`;
    debug('serverPath', serverPath);
    const port = await detect(DEFAULT_PORT);
    debug('port', port);
    const targetUrl = `http://127.0.0.1:${port}/index.html`;
    debug('targetUrl', targetUrl);
    const viewsPath = `${serverPath}/views`;
    await fse.ensureDir(viewsPath);
    debug('viewsPath', viewsPath);
    const demos = (await fse.readdir(demoPath)) || [];
    debug('demos', demos);
    const selectors = demos.filter(item => /^.*\.md$/g.test(item)).map(item => item.replace(/\.md$/g, ''));
    debug('selectors', selectors);
    if(!selectors.length){
      return;
    }
    const snapshots = await screenshotWithLocalServer(serverPath, port, targetUrl, selectors, viewsPath);
    debug('snapshots', snapshots);
    pkg.snapshots = snapshots;
  });
};
