const { getESLintConfig } = require('@iceworks/spec');

module.exports = getESLintConfig('common-ts', {
  rules: {
    'no-nested-ternary': 'off',
    'no-await-in-loop': 'off',
    'no-multi-assign': 'off',
  },
});
