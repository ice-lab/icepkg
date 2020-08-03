#!/usr/bin/env node
const chalk = require('chalk');
const ora = require('ora');
const detect = require('detect-port');
const fs = require('fs');

const createServer = require('../utils/createServer');
const getPuppeteer = require('./getPuppeteer');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * take a screenshot with local server
 *
 * @param {string} serverPath local server directory
 * @param {number} port server port
 * @param {string} targetUrl the target url
 * @param {string} output output path
 */
async function screenshotWithLocalServer({ packageJsonPath, serverPath, targetUrl, imgOutput, htmlOutput, timeout = 2000, routePath }) {
  const DEFAULT_PORT = 8100;
  const port = await detect(DEFAULT_PORT);
  const server = createServer(serverPath, port);
  const url = !routePath
    ? `http://127.0.0.1:${port}${targetUrl}`
    : `http://127.0.0.1:${port}${routePath}`; // scaffold type
  await screenshot(packageJsonPath, url, imgOutput, htmlOutput, timeout);
  server.close();
}

/**
 * take a screenshot of web page
 * @param {string} packageJsonPath package.json paths
 * @param {string} url the target url
 * @param {string} imgOutput img output path
 * @param {string} htmlOutput html output path
 */
async function screenshot(packageJsonPath, url, imgOutput, htmlOutput, timeout) {
  // a terminal spinner
  const spinner = ora(`screenshoting ... ${url}`).start();

  try {
    const puppeteer = await getPuppeteer();
    // start puppeteer
    const browser = await puppeteer.launch();
    // create a new page
    const page = await browser.newPage();
    // set page's viewport
    page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    });

    // visit the target url
    await page.goto(url);
    if (timeout) {
      await sleep(timeout);
    }

    // screenshot full page
    await page.screenshot({ path: imgOutput });

    // get and save html content
    const htmlContent = await page.evaluate(() => {
      // convert all canvas to img
      for (let i = 0; i < document.getElementsByTagName("canvas").length; i++) {
        document.getElementsByTagName("canvas")[i].outerHTML = `<img src="${document.getElementsByTagName("canvas")[i].toDataURL("image/png", 1)}"/>`;
      }
      // delete <script> tag
      const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      const IFRAME_REGEX = /<iframe\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/iframe>/gi;

      return document.body.innerHTML.replace(SCRIPT_REGEX, "").replace(IFRAME_REGEX, "");
    });
    fs.writeFileSync(htmlOutput, htmlContent);

    // close chromium
    await browser.close();
    spinner.succeed(chalk.green('Screenshot success!'));
  } catch (err) {
    spinner.fail(chalk.red('Screenshot fail!'));
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
    process.exit(1);
  }
}

module.exports = screenshotWithLocalServer;
