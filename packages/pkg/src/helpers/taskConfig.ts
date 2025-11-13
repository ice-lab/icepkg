import { BundleTaskConfig, TaskConfig, TransformTaskConfig } from '../types';

export function assertTaskBuildableConfig(
  taskConfig: TaskConfig,
): asserts taskConfig is BundleTaskConfig | TransformTaskConfig {
  if (taskConfig.type !== 'bundle' && taskConfig.type !== 'transform') {
    throw new Error('Only accept bundle or transform task.');
  }
}

export function assertTaskBundleConfig(taskConfig: TaskConfig): asserts taskConfig is BundleTaskConfig {
  if (taskConfig.type !== 'bundle') {
    throw new Error('Only accept bundle task.');
  }
}
