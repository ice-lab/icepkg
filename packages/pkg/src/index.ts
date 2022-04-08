import { Service } from 'build-scripts';
import build from './build.js';
import start from './start.js';

const componentService = new Service({
  name: 'componentService',
  command: {
    build,
    start,
  },
});

export default componentService;

export * from './types.js';

export { defineConfig } from './defineConfig.js';
