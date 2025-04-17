import type { Service } from 'build-scripts';
import type { TaskConfig, UserConfig } from '../types';
import { getBuiltInPlugins } from '../utils.js';

export default async function getTaskConfig(service: Service<TaskConfig, {}, UserConfig>) {
  const { taskConfigs, context } = (await service.run({
    command: 'test',
    commandArgs: {},
    getBuiltInPlugins,
  })) as any;

  if (taskConfigs.length === 0) {
    throw new Error('No task config was found.');
  }

  return {
    taskConfig: taskConfigs[0] as TaskConfig,
    context,
  };
}
