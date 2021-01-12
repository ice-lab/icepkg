const { BYTEDANCE, MINIAPP, WECHAT_MINIPROGRAM } = require('../../constants');

const CONFIG = {
  process: false,
  global: false,
};

module.exports = [
  {
    name: 'targets',
    validation: 'array',
  },
  {
    name: 'inlineStyle',
    validation: 'boolean',
  },
  {
    name: 'enablePlatformLoader',
    validation: 'boolean',
  },
  {
    name: 'watchDist',
    validation: 'boolean',
  },
  {
    name: 'disableUMD',
    validation: 'boolean',
  },
  {
    /**
     * support disable mock node env
     * https://webpack.js.org/configuration/node/
     */
    name: 'mockNodeEnv',
    defaultValue: true,
    validation: (val) => {
      return typeof val === 'boolean' || typeof val === 'object';
    },
    configWebpack: (config, value) => {
      if (value === false) {
        Object.keys(CONFIG).forEach((key) => {
          config.node.set(key, CONFIG[key]);
        });
      } else if (typeof value === 'object') {
        Object.keys(value).forEach((key) => {
          config.node.set(key, value[key]);
        });
      }
    },
  },
  {
    name: BYTEDANCE,
    validation: 'object',
  },
  {
    name: MINIAPP,
    validation: 'object',
  },
  {
    name: WECHAT_MINIPROGRAM,
    validation: 'object',
  },
];
