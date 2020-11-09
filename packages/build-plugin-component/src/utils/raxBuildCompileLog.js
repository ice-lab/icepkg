const path = require('path');
const chalk = require('chalk');
const { handleWebpackErr } = require('rax-compile-config');
const { platformMap } = require('miniapp-builder-shared');
const consoleClear = require('console-clear');
const { WEB, WEEX } = require('../constants');

function raxBuildCompileLog({ err, stats }, targets, rootDir, options) {
  consoleClear(true);

  if (!handleWebpackErr(err, stats)) {
    return;
  }
  console.log(chalk.green('Rax Component build finished:'));
  console.log();

  if (targets.includes(WEB) || targets.includes(WEEX)) {
    console.log(chalk.green('Component lib at:'));
    console.log('   ', chalk.underline.white(path.resolve(rootDir, 'lib')));
    console.log();

    console.log(chalk.green('Component dist at:'));
    console.log('   ', chalk.underline.white(path.resolve(rootDir, 'dist')));
    console.log();
  }
  Object.entries(platformMap).forEach(([platform, config]) => {
    if (targets.includes(platform)) {
      console.log(chalk.green(`[${config.name}] Component lib at:`));
      const distDir = (options[platform] && options[platform].distDir) || `lib/${platform}`;
      console.log('   ', chalk.underline.white(path.resolve(rootDir, distDir)));
      console.log();
    }
  });
}

module.exports = raxBuildCompileLog;
