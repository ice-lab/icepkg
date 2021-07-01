const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const { isWebIDE, getWebIDEDevUrl } = require('./webIDEHelper');

module.exports = ({ urls, stats, log, context }) => {
  const { port } = context.commandArgs;

  const statsJson = stats.toJson({
    all: false,
    errors: true,
    warnings: true,
    timings: true,
  });

  const messages = formatWebpackMessages(statsJson);
  const hasError = messages.errors.length;

  // compatible with webpack 5
  ['errors', 'warnings'].forEach((jsonKey) => {
    statsJson[jsonKey] = (statsJson[jsonKey] || []).map((item) => (item.message || item));
  });

  log.info(stats.toString({
    errors: true,
    warnings: false,
    colors: true,
    assets: true,
    chunks: false,
    entrypoints: false,
    modules: false,
    timings: false,
  }));

  if (!hasError) {
    log.info('');
    log.info(chalk.green(' Starting the development server at:'));
    if (isWebIDE) {
      log.info('   - IDE server: ', chalk.underline.white(getWebIDEDevUrl(port)));
    } else {
      log.info('   - Local  : ', chalk.underline.white(urls.localUrlForBrowser));
      log.info('   - Network: ', chalk.underline.white(urls.lanUrlForTerminal));
    }
  }
};
