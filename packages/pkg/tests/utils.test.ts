import { performance } from 'node:perf_hooks';
import picocolors from 'picocolors';
import { afterEach, describe, it, expect, vi, Mock } from 'vitest';
import { concurrentPromiseAll, delay, formatTimeCost, timeFrom } from '../src/utils';

const MOCK_TASK_TIME = 20;

function buildTasks<T extends unknown[]>(values: T) {
  return values.map((value) =>
    vi.fn(
      () =>
        new Promise<T[number]>((resolve, reject) =>
          setTimeout(() => {
            if (value instanceof Error) {
              reject(value);
            } else {
              resolve(value);
            }
          }, MOCK_TASK_TIME),
        ),
    ),
  );
}

function taskStatus(tasks: Mock[]) {
  return tasks.map((task) => task.mock.calls.length);
}

function mockColor(name: 'green' | 'yellow' | 'red') {
  return vi
    .spyOn(picocolors, name)
    .mockImplementation((input: string | number | null | undefined) => `${name}(${String(input)})`);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('concurrentPromiseAll', () => {
  it('should execute all tasks and return the expected result', async () => {
    const values = [1, 2, 3];
    const tasks = buildTasks(values);
    const result = await concurrentPromiseAll(tasks);
    expect(result).toEqual(values);
  });

  it('should handle more than maximum concurrency tasks correctly', async () => {
    const values = [1, 2, 3, 4, 5, 6];
    const tasks = buildTasks(values);
    const resultPromise = concurrentPromiseAll(tasks, 2);
    expect(taskStatus(tasks)).toEqual([1, 1, 0, 0, 0, 0]);
    await delay(MOCK_TASK_TIME);
    expect(taskStatus(tasks)).toEqual([1, 1, 1, 1, 0, 0]);
    const result = await resultPromise;
    expect(result).toEqual(values);
  });

  it('should stop execution when an error occurs in one of the tasks', async () => {
    const values = [1, new Error('Task failed'), 3];
    const tasks = buildTasks(values);

    try {
      await concurrentPromiseAll(tasks);
      expect(true).toBeFalsy(); // 应该永远不会到达这里
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Task failed');
    }
  });

  it('should return an empty array when given an empty task list', async () => {
    const result = await concurrentPromiseAll([]);
    expect(result).toEqual([]);
  });
});

describe('time formatting', () => {
  it('should format plain text time cost in seconds without colors', () => {
    expect(formatTimeCost(120, false)).toBe('0.12s');
    expect(formatTimeCost(4567, false)).toBe('4.57s');
  });

  it('should colorize formatTimeCost based on second thresholds', () => {
    mockColor('green');
    mockColor('yellow');
    mockColor('red');

    expect(formatTimeCost(120)).toBe('green(0.12s)');
    expect(formatTimeCost(4200)).toBe('yellow(4.20s)');
    expect(formatTimeCost(5000)).toBe('red(5.00s)');
  });

  it('should format timeFrom in seconds using the same thresholds', () => {
    mockColor('green');
    mockColor('yellow');
    mockColor('red');

    const now = vi.spyOn(performance, 'now');
    now.mockReturnValue(1120);
    expect(timeFrom(1000)).toBe('green(0.12s)');

    now.mockReturnValue(5200);
    expect(timeFrom(1000)).toBe('yellow(4.20s)');

    now.mockReturnValue(6200);
    expect(timeFrom(1000)).toBe('red(5.20s)');
  });
});
