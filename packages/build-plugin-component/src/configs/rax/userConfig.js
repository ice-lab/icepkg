const { BYTEDANCE, MINIAPP, WECHAT_MINIPROGRAM } = require('../../constants');
const htmlInjection = require('../../utils/htmlInjection');

// set default content of html
htmlInjection.configHTMLContent({
  headPrepend: [
    {
      tag: 'meta',
      charset: 'utf-8',
      tagId: 'meta-charset',
    },
    {
      tag: 'meta',
      'http-equiv': 'x-ua-compatible',
      content: 'ie=edge,chrome=1',
      tagId: 'meta-compatible',
    },
    {
      tag: 'meta',
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no',
      tagId: 'meta-viewport',
    },
  ],
  headAppend: [
    {
      tag: 'title',
      innerHTML: 'DEMO 预览',
    },
  ],
  rootContainer: '<div id="root"></div>',
});

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
  // compatible with plugins which modifyUserConfig of outputDir
  {
    name: 'outputDir',
    validation: 'string',
  },
  {
    name: 'htmlInjection',
    validation: 'object',
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
  {
    name: 'babelPlugins',
    validation: 'array',
  },
];
