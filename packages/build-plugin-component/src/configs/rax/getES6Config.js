const getDistConfig = require('./getDistConfig');
const _ = require('lodash');

module.exports = (context, options) => {
  const config = getDistConfig(context, {...options, isES6: true});
  config.output.filename('index-es6.js');
  return config;
};
