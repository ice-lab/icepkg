const path = require('path');
const { default: Herbox } = require('@alipay/herbox-cli');

module.exports = async function (rootDir, command, demos) {
  const herboxConfig = require(path.join(rootDir, './.herboxrc.js'));
  const { basement, pubConfig } = herboxConfig;
  const herbox = new Herbox({ basement });
  for (let i = 0; i < demos.length; i++) {
    const _pubConfig = Object.assign({
      cwd: path.join(rootDir, `build/mini-program-demos/rax-herbox-${demos[i].filename}`),
      id: demos[i].filename,
      component2: true,
      prod: command === 'build',
    }, pubConfig);
    await herbox.pub(_pubConfig);
  }
};