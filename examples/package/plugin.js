const path = require('path');

module.exports = ({ onGetConfig, context }) => {
  const { rootDir } = context;

  // apply for only es
  onGetConfig('component-es', (config) => {
    config.outputDir = path.join(rootDir, 'es');
  });

  // 如果用户需要移除某一个 task
};
