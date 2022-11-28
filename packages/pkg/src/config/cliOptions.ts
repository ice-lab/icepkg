import { mergeValueToTaskConfig } from '../utils.js';
import { TaskConfig } from '../types';

const cliOptions = [
  {
    name: 'analyzer',
    commands: ['start', 'build'],
    setConfig: (config: TaskConfig, analyzer: boolean) => {
      return mergeValueToTaskConfig(config, 'analyzer', analyzer);
    },
  },
  {
    name: 'dist',
    commands: ['start'],
  },
];

export default cliOptions;
