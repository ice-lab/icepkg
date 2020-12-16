const path = require('path');
const { default: Herbox } = require('@alipay/herbox-cli');

module.exports = async function(rootDir, name, command) {
  const herboxConfig = require(path.join(rootDir, './.herboxrc.js'));
  const { basement, pubConfig } = herboxConfig;
  const herbox = new Herbox({ basement });
  const id = name.startsWith('@ali') ? name.slice(5) : name;
  const _pubConfig = Object.assign({
    cwd: path.join(rootDir, 'build/ali-miniapp'),
    id,
    component2: true,
    prod: command === 'build',
  }, pubConfig);
  await herbox.pub(_pubConfig);
}