module.exports = [
  {
    name: 'targets',
    validation: 'array',
  },
  {
    name: 'forceInline',
    validation: 'boolean',
  },
  {
    name: 'enablePlatformLoader',
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
];