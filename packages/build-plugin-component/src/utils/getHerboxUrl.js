const path = require('path');
const { default: Herbox } = require('@alipay/herbox-cli');

const herboxConfig = {
  basement: { // basement 属性必须
    accountName: 'aljk-miniapp-viewer',
    appId: '5f40cfefea1f93c19b41bf24',
    masterKey: 'KMNBLPrW0FuueH6HBEnw3_-P',
  },
}

module.exports = async function(rootDir, name, command) {
  const herbox = new Herbox(herboxConfig);
  const id = name.startsWith('@ali') ? name.slice(5) : name;
  const pubConfig = {
    cwd: path.join(rootDir, 'build/ali-miniapp'),
    id,
    component2: true,
    prod: command === 'build',
  };
  await herbox.pub(pubConfig);
}