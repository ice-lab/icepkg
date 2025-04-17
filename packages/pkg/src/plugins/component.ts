import type { Plugin } from '../types.js';
import { getCliOptions, getUserConfig } from '../config/index.js';

const plugin: Plugin = (api) => {
  const { registerUserConfig, registerCliOption } = api;
  registerUserConfig(getUserConfig());
  registerCliOption(getCliOptions());
};

export default plugin;
