const path = require('path');

module.exports = [
  {
    name: 'alias',
    validation: 'object',
    configWebpack: (config, alias, context) => {
      const { rootDir } = context;
      const aliasWithRoot = {};
      Object.keys(alias).forEach((key) => {
        if (path.isAbsolute(alias[key])) {
          aliasWithRoot[key] = alias[key];
        } else {
          aliasWithRoot[key] = path.resolve(rootDir, alias[key]);
        }
      });
      config.merge({
        resolve: {
          alias: aliasWithRoot,
        },
      });
    },
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
    name: 'filename',
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
  // compatible with plugins which modifyUserConfig of outputDir
  {
    name: 'outputDir',
    validation: 'string',
  },
];
