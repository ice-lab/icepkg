function getUserConfig() {
  const userConfig = [
    {
      name: 'entry',
      defaultValue: 'src/index',
    },
    {
      name: 'alias',
      defaultValue: {},
    },
    {
      name: 'define',
    },
    // TODO: Modify `sourcemaps` to `sourcemap` and make sure to be compatible with icepkg v1 version.
    {
      name: 'sourceMaps',
    },
    {
      name: 'jsxRuntime',
      defaultValue: 'automatic',
    },
    {
      name: 'declaration',
      defaultValue: true,
    },
    {
      name: 'transform',
    },
    {
      name: 'bundle',
    },
    {
      name: 'pkgs',
    },
  ];
  return userConfig;
}

export default getUserConfig;
