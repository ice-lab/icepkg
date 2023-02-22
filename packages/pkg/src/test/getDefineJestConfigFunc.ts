import { getBuiltInPlugins } from '../utils.js';

import type { Service } from 'build-scripts';
import type { TaskConfig, UserConfig } from '../types';

export default function getDefineJestConfigFunc(service: Service<TaskConfig, {}, UserConfig>) {
  const taskConfigs = service.run({
    command: 'test',
    commandArgs: {},
    getBuiltInPlugins,
  });
  console.log('taskConfigs===>', taskConfigs);
}
