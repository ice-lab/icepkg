const path = require('path');
const { default: Herbox } = require('@alipay/herbox-cli');

module.exports = async function (rootDir, demos, command) {
  const herboxConfig = require(path.join(rootDir, './.herboxrc.js'));
  const { basement, pubConfig } = herboxConfig;
  const herbox = new Herbox({ basement });
  demos.forEach(demo => {
    const _pubConfig = Object.assign({
      cwd: path.join(rootDir, `build/mini-program-demos/rax-herbox-${demo.filename}`),
      id: demo.filename,
      component2: true,
      prod: command === 'build',
    }, pubConfig);
    herbox.pub(_pubConfig);
  })
};