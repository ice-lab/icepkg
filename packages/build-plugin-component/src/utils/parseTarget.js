const { MINIAPP } = require('../constants');

module.exports = function parseTarget(target) {
  return target === MINIAPP ? 'ali-miniapp' : target;
};
