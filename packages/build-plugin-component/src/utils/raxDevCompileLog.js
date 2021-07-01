const path = require('path');
const chalk = require('chalk');
const ip = require('ip');
const consoleClear = require('console-clear');
const qrcode = require('qrcode-terminal');
const { handleWebpackErr } = require('rax-compile-config');
const { platformMap } = require('miniapp-builder-shared');
const { WEB, WEEX, NODE, MINIAPP } = require('../constants');
const { isWebIDE, getWebIDEDevUrl } = require('./webIDEHelper');

function devCompileLog(devCompleted, context, options) {
  consoleClear(true);

  const { userConfig: { targets }, rootDir, commandArgs: { port } } = context;
  const { entries, watchDist } = options;

  const { err, stats, url } = devCompleted;

  const devUrl = isWebIDE ? getWebIDEDevUrl(port) : url;

  if (!handleWebpackErr(err, stats)) {
    return;
  }

  console.log(chalk.green('Rax development server has been started:'));
  console.log();

  if (watchDist) {
    console.log(chalk.green('[Dist] Development pages:'));
    const distBundles = [];
    if (targets.includes(WEB)) {
      distBundles.push('index', 'index-es6');
    } else if (targets.includes(WEEX)) {
      distBundles.push('index-weex');
    }
    distBundles.forEach((distBundle) => {
      console.log('   ', chalk.underline.white(`${devUrl}${distBundle}.js`));
    });
    return;
  }

  const entryKeys = Object.keys(entries);
  if (entryKeys.length) {
    console.log(chalk.green('[DEMO] demo portal served at:'));
    console.log('   ', chalk.underline.white(`${devUrl}demo/portal`));
    console.log();
  }

  if (targets.includes(WEB)) {
    console.log(chalk.green('[Web] Development pages:'));
    Object.keys(entries).forEach((entry) => console.log('   ', chalk.underline.white(devUrl + entry)));
    console.log();
  }

  if (targets.includes(NODE)) {
    console.log(chalk.green('[SSR] Development pages:'));
    Object.keys(entries).forEach((entry) => console.log('   ', chalk.underline.white(`${devUrl}ssr/${entry}`)));
    console.log();
  }

  if (targets.includes(WEEX)) {
    console.log(chalk.green('[Weex] Development server at:'));

    Object.keys(entries).forEach((entry) => {
      // Use Weex App to scan ip address (mobile phone can't visit localhost).
      const weexUrl = `${devUrl}weex/${entry}.js?wh_weex=true`.replace(/^http:\/\/localhost/gi, (match) => {
        // Called when matched
        try {
          return `http://${ip.address()}`;
        } catch (error) {
          console.log(chalk.yellow(`Get local IP address failed: ${error.toString()}`));
          return match;
        }
      });
      console.log('   ', chalk.underline.white(weexUrl));
      console.log();
      qrcode.generate(weexUrl, { small: true });
      console.log();
    });
  }

  if (targets.includes('kraken')) {
    console.log(chalk.green('[Kraken] Development server at:'));

    Object.keys(entries).forEach((entry) => {
      // Use Weex App to scan ip address (mobile phone can't visit localhost).
      const krakenUrl = `${devUrl}kraken/${entry}.js`;
      console.log('   ', chalk.underline.white(krakenUrl));
    });
  }

  Object.entries(platformMap).forEach(([platform, config]) => {
    if (targets.includes(platform)) {
      let outputPath = '';
      if (options[platform] && options[platform].distDir) {
        outputPath = options[platform].distDir;
        console.log(chalk.green(`[${config.name}] Component lib at: `));
      } else {
        outputPath = `build/${platform === MINIAPP ? 'ali-miniapp' : platform}`;
        console.log(chalk.green(`[${config.name}] Use ali miniapp developer tools to open the following folder:`));
      }
      console.log('   ', chalk.underline.white(path.resolve(rootDir, outputPath)));
      console.log();
    }
  });
}

module.exports = devCompileLog;
