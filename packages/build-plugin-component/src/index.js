module.exports = (api) => {
  const { context, log } = api;
  const { userConfig } = context;
  if (userConfig.type && !['rax', 'react'].includes(userConfig.type)) {
    log.error('build-plugin-component need to set type react/rax');
  } else {
    const componentType = userConfig.type || 'react';
    // eslint-disable-next-line
    require(`./${componentType}`)(api);
  }
};
