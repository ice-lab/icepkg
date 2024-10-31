import { describe, it, expect, vi, Mock } from 'vitest';
import { concurrentPromiseAll, delay } from '../src/utils'

const MOCK_TASK_TIME = 20;

function buildTasks<T extends unknown[]>(values: T) {
  return values.map(value => vi.fn(() => new Promise<T[number]>((resolve, reject) => setTimeout(() => {
    if (value instanceof Error) {
      reject(value)
    } else {
      resolve(value)
    }
  }, MOCK_TASK_TIME))))
}

function taskStatus(tasks: Array<Mock>) {
  return tasks.map(task => task.mock.calls.length)
}

describe('concurrentPromiseAll', () => {
  it('should execute all tasks and return the expected result', async () => {
    const values = [1,2,3]
    const tasks = buildTasks(values);
    const result = await concurrentPromiseAll(tasks);
    expect(result).toEqual(values);
  });

  it('should handle more than maximum concurrency tasks correctly', async () => {
    const values = [1,2,3,4,5,6]
    const tasks = buildTasks(values);
    const resultPromise = concurrentPromiseAll(tasks, 2);
    expect(taskStatus(tasks)).toEqual([1,1,0,0,0,0])
    await delay(MOCK_TASK_TIME)
    expect(taskStatus(tasks)).toEqual([1,1,1,1,0,0])
    const result = await resultPromise
    expect(result).toEqual(values);
  });

  it('should stop execution when an error occurs in one of the tasks', async () => {
    const values = [1, new Error('Task failed'), 3]
    const tasks = buildTasks(values)

    try {
      await concurrentPromiseAll(tasks);
      expect(true).toBeFalsy(); // 应该永远不会到达这里
    } catch (error) {
      expect(error.message).toBe('Task failed');
    }
  });

  it('should return an empty array when given an empty task list', async () => {
    const result = await concurrentPromiseAll([]);
    expect(result).toEqual([]);
  });
});
