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
      content: 'width=device-width',
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

module.exports = [
  {
    name: 'demoTemplate',
    validation: (val) => {
      return Array.isArray(val) || typeof val === 'string';
    },
  },
  {
    name: 'babelPlugins',
    validation: 'array',
  },
  {
    name: 'babelOptions',
    // [{ name: '@babel/preset-env', options: { module: false } }]
    validation: 'array',
  },
  {
    name: 'basicComponents',
    validation: (val) => {
      return Array.isArray(val) || val === false;
    },
  },
  {
    name: 'externals',
    validation: 'object',
  },
  {
    name: 'subComponents',
    validation: 'boolean',
  },
  {
    name: 'htmlInjection',
    validation: 'object',
  },
  {
    name: 'disableGenerateStyle',
    validation: 'boolean',
  },
  {
    name: 'docGenIncludes',
    validation: (val) => {
      if (!Array.isArray(val)) {
        return false;
      }
      for (let i = 0; i < val.length; i++) {
        if (typeof val[i] !== 'string') {
          return false;
        }
      }
      return true;
    },
  },
];
