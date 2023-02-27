import { getBuildTasks } from '../helpers/getBuildTasks.js';

import type { Context } from '../types.js';

export default async function test(context: Context) {
  const buildTasks = getBuildTasks(context);
  const taskConfigs = buildTasks.map(({ config }) => config);

  return {
    taskConfigs,
    context,
  };
}
