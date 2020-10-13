const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  env: {
    jest: true
  },
  rules: {},
});
