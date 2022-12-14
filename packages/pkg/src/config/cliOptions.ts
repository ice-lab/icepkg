import { mergeValueToTaskConfig } from '../utils.js';
import { TaskConfig } from '../types';

function getCliOptions() {
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
      // TODO: should set it to taskConfig
    },
  ];
  return cliOptions;
}

export default getCliOptions;
