import { BuildTask, type TaskOrder } from '../types.js';

const TASK_ORDER_WEIGHT: Record<TaskOrder, number> = {
  pre: 0,
  builtin: 1,
  normal: 2,
  post: 3,
};

function getTaskOrderWeight(order?: unknown): number {
  return TASK_ORDER_WEIGHT[order as TaskOrder] ?? TASK_ORDER_WEIGHT.normal;
}

export function sortBuildTasksByOrder(buildTasks: BuildTask[]): BuildTask[] {
  return [...buildTasks].sort((left, right) => {
    return getTaskOrderWeight(left.config.order) - getTaskOrderWeight(right.config.order);
  });
}
