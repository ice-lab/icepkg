import type { BuildTask, Context } from '../types.js';

export default async function test(context: Context) {
  const buildTasks = context.getTaskConfig() as BuildTask[];
  const taskConfigs = buildTasks.map(({ config }) => config);

  return {
    taskConfigs,
    context,
  };
}
