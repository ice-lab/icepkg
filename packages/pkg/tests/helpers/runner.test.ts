import { expect, describe, it } from 'vitest';
import { Runner, RunnerStatus } from '../../src/helpers/runner';
import { TaskRunnerContext, WatchChangedFile } from '../../src';
import { delay } from '../../src/utils';

class MockRunner extends Runner {
  doRun(files?: WatchChangedFile[]): Promise<unknown> {
    return Promise.resolve({});
  }

  doRunWithError(): Promise<unknown> {
    return Promise.reject(new Error('Test error'));
  }
}

describe('Runner Tests', () => {
  const mockContext: TaskRunnerContext = {
    buildTask: {
      name: 'transform-esm',
    },
  } as TaskRunnerContext;

  it('should initialize with correct initial state', () => {
    const runner = new MockRunner(mockContext);

    expect(runner.status).toBe(RunnerStatus.Init);
    expect(runner.isFinished).toBeFalsy();
    expect(runner.isError).toBeFalsy();
    expect(runner.isRunning).toBeFalsy();
  });

  it('should update status when running and finishing tasks', async () => {
    const runner = new MockRunner(mockContext);

    await runner.run();

    expect(runner.status).toBe(RunnerStatus.Finished);
    expect(runner.isFinished).toBeTruthy();
    expect(runner.isRunning).toBeFalsy();
  });

  it('should handle errors during task execution', async () => {
    const runner = new MockRunner(mockContext);

    runner.doRun = runner.doRunWithError.bind(runner);

    try {
      await runner.run();
    } catch (error) {
      expect(error.message).toBe('Test error');
    }

    expect(runner.status).toBe(RunnerStatus.Error);
    expect(runner.isError).toBeTruthy();
    expect(runner.isRunning).toBeFalsy();
  });

  it('should correctly record marks', async () => {
    const runner = new MockRunner(mockContext);

    // test single mark
    runner.mark('testMark');

    {
      const metric = runner.getMetric('testMark');
      expect(metric.delta).toEqual([0]);
      expect(metric.cost).toBe(0);
    }

    await delay(50);
    runner.mark('testMark');

    {
      const metric = runner.getMetric('testMark');
      expect(metric.delta.length).toEqual(2);
      expect(metric.cost).toBeGreaterThanOrEqual(50);
    }
  });

  it('should update progress correctly', () => {
    const runner = new MockRunner(mockContext);

    runner.updateProgress(1, 10);
    expect(runner.getProgress()).toEqual([1, 10]);

    runner.updateProgress(2);
    expect(runner.getProgress()).toEqual([2, 10]);
  });
});
