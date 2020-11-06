const chalk = require('chalk');
const debug = require('debug')('build-plugin-component-screenshot');
const ora = require('ora');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const createServer = require('../utils/createServer');
const getPuppeteer = require('../utils/getPuppeteer');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * minify an image
 *
 * @param {String} imgPath
 * @param {*} outputDir output dir
 * @returns
 */
async function minifyImg(imgPath, outputDir) {
  return imagemin([imgPath], outputDir, {
    plugins: [imageminPngquant()],
  });
}

/**
 * take a screenshot of web page
 *
 * @param {string} url the target url
 * @param {array} selectors screenshot target CSS selector
 * @param {string} viewsPath output path
 */
async function screenshot(url, selectors = [], viewsPath, timeout) {
  // a terminal spinner
  const spinner = ora('generating ...').start();

  try {
    const puppeteer = await getPuppeteer();

    // start puppeteer
    const browser = await puppeteer.launch();

    // create a new page
    const page = await browser.newPage();

    // set page's viewport
    page.setViewport({
      width: 1240,
      height: 600,
      deviceScaleFactor: 2,
    });
    // visit the target url
    await page.goto(url);

    if (timeout) {
      await sleep(timeout);
    }

    const res = await Promise.all(selectors.map(async item => {
      const output = `${viewsPath}/${item}.png`;
      const el = await page.$(`#${item}`);
      await el.screenshot({ path: output });
      await minifyImg(output, output);
      return `views/${item}.png`;
    }));

    // close chromium
    await browser.close();

    spinner.succeed(chalk.green('generating success!'));
    return res;
  } catch (err) {
    spinner.fail(chalk.red('generating fail!'));
    // chromium not download error
    // stdout reinstall puppeteer tips.
    if (err.message === 'Chromium revision is not downloaded. Run "npm install" or "yarn install"') {
      console.log(chalk.red('\n\nPuppeteer Install fail. \nPlease install puppeteer using the following commands:'));
      console.log(chalk.white('\n  npm uninstall puppeteer -g'));
      console.log(chalk.white('\n  PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org npm i puppeteer -g --registry=https://registry.npm.taobao.org'));
      console.log(chalk.white('\n  screenshot -u http://www.example.com\n'));
    } else {
      console.error(err);
    }
  }
}


/**
 * take a screenshot with local server
 *
 * @param {string} serverPath local server directory
 * @param {number} port server port
 * @param {string} targetUrl the target url
 * @param {array} selectors the target CSS selector
 * @param {string} viewsPath output path
 */
async function screenshotWithLocalServer(serverPath, port, targetUrl, selectors = [], viewsPath, timeout) {

  const server = createServer(serverPath, port);
  debug('screenshot start');
  const res = await screenshot(targetUrl, selectors, viewsPath, timeout);
  debug('screenshot complete');
  server.close();
  debug('server closed');
  return res;
}

module.exports = screenshotWithLocalServer;