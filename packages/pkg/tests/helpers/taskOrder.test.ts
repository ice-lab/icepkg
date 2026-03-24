import { describe, expect, it } from 'vitest';
import { sortBuildTasksByOrder } from '../../src/helpers/taskOrder';
import { BuildTask, TaskOrder, TaskConfig } from '../../src/types';

function createTask(name: string, type: TaskConfig['type'], order?: TaskOrder): BuildTask {
  switch (type) {
    case 'transform':
      return {
        name,
        config: {
          type,
          order,
          format: {
            module: 'esm',
            target: 'es2017',
          },
        },
      } as BuildTask;
    case 'bundle':
      return {
        name,
        config: {
          type,
          order,
          formats: [
            {
              module: 'esm',
              target: 'es2017',
            },
          ],
        },
      } as BuildTask;
    case 'declaration':
      return {
        name,
        config: {
          type,
          order,
        },
      } as BuildTask;
  }
}

describe('sortBuildTasksByOrder', () => {
  it('should sort globally by pre/builtin/normal/post across task types', () => {
    const tasks: BuildTask[] = [
      createTask('bundle-normal', 'bundle'),
      createTask('transform-builtin', 'transform', 'builtin'),
      createTask('transform-post', 'transform', 'post'),
      createTask('declaration-pre', 'declaration', 'pre'),
      createTask('transform-normal', 'transform'),
    ];

    const sorted = sortBuildTasksByOrder(tasks);
    expect(sorted.map((task) => task.name)).toEqual([
      'declaration-pre',
      'transform-builtin',
      'bundle-normal',
      'transform-normal',
      'transform-post',
    ]);
  });

  it('should treat undefined order as normal and keep builtin before normal', () => {
    const tasks: BuildTask[] = [
      createTask('a-post', 'transform', 'post'),
      createTask('b-builtin', 'bundle', 'builtin'),
      createTask('b-normal', 'bundle'),
      createTask('c-pre', 'declaration', 'pre'),
    ];

    const sorted = sortBuildTasksByOrder(tasks);
    expect(sorted.map((task) => task.name)).toEqual(['c-pre', 'b-builtin', 'b-normal', 'a-post']);
  });

  it('should preserve original order for tasks with same order', () => {
    const tasks: BuildTask[] = [
      createTask('first-pre', 'transform', 'pre'),
      createTask('second-pre', 'bundle', 'pre'),
      createTask('third-pre', 'declaration', 'pre'),
    ];

    const sorted = sortBuildTasksByOrder(tasks);
    expect(sorted.map((task) => task.name)).toEqual(['first-pre', 'second-pre', 'third-pre']);
  });

  it('should treat invalid order as normal', () => {
    const invalidOrderTask = createTask('invalid-order', 'transform') as BuildTask;
    (invalidOrderTask.config as { order?: string }).order = 'before-all';

    const tasks: BuildTask[] = [
      createTask('pre-task', 'declaration', 'pre'),
      invalidOrderTask,
      createTask('post-task', 'bundle', 'post'),
    ];

    const sorted = sortBuildTasksByOrder(tasks);
    expect(sorted.map((task) => task.name)).toEqual(['pre-task', 'invalid-order', 'post-task']);
  });
});
