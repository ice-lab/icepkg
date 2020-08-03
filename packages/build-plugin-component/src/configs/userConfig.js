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
    name: 'filename',
    validation: 'string',
  },
  {
    name: 'library',
    validation: 'string',
  },
  {
    name: 'libraryExport',
    validation: 'string',
  },
  {
    name: 'libraryTarget',
    validation: 'string',
  },
  {
    name: 'sourceMap',
    validation: 'boolean',
  },
  {
    name: 'externals',
    validation: 'object',
  },
  {
    name: 'minify',
    validation: 'boolean',
  },
  {
    name: 'devServer',
    validation: 'object',
    configWebpack: (config, devServer, context) => {
      const { command } = context;
      if (command === 'start' && devServer) {
        config.merge({ devServer });
      }
    },
  },
];