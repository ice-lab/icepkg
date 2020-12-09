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
    name: 'basicRepo',
    validation: 'boolean',
  }
];