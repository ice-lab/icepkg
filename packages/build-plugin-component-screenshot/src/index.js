const debug = require('debug')('build-plugin-component-screenshot');
const detect = require('detect-port');
const fse = require('fs-extra');
const screenshotWithLocalServer = require('./screenshot');

const DEFAULT_PORT = 8100;

module.exports = ({ context, onHook, log }) => {
  const { rootDir, pkg } = context;
  onHook('after.build.compile', async () => {
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
    const selectors = demos.filter((item) => /^.*\.md$/g.test(item)).map((item) => item.replace(/\.md$/g, ''));
    debug('selectors', selectors);
    if (!selectors.length) {
      return;
    }
    const snapshots = await screenshotWithLocalServer(serverPath, port, targetUrl, selectors, viewsPath);
    debug('snapshots', snapshots);
    fse.writeFileSync(`${rootDir}/build/screenshots.json`, JSON.stringify(snapshots));
    pkg.snapshots = snapshots;
  });
};
