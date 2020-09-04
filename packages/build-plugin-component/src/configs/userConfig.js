module.exports = [
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
    name: 'minify',
    validation: 'boolean',
  },
  {
    name: 'type',
    validation: 'string',
  },
  {
    name: 'devServer',
    validation: 'object',
    defaultValue: {
      logLevel: 'silent',
      compress: true,
      disableHostCheck: true,
      clientLogLevel: 'error',
      hot: true,
      quiet: true,
      overlay: false,
    },
    configWebpack: (config, devServer, context) => {
      const { command } = context;
      if (command === 'start' && devServer) {
        config.merge({ devServer });
      }
    },
  },
];