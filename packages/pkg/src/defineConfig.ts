import { UserConfig } from './types';

/**
 * Provide intellisense of user config.
 */
export const defineConfig = (options: UserConfig | (() => UserConfig)): UserConfig => {
  if (typeof options === 'function') {
    return options();
  } else {
    return options;
  }
};
