import { expect, it, vi } from 'vitest';
import { Runner } from '../../src/helpers/runner';
import { RunnerScheduler } from '../../src/helpers/runnerScheduler';
import { TaskRunnerContext, WatchChangedFile } from '../../src/types';
import { RunnerReporter } from '../../src/helpers/runnerReporter';

class MockRunner extends Runner {
  get isParallel() {
    return this._isParallel;
  }

  constructor(
    context: TaskRunnerContext,
    private _isParallel: boolean,
    private _value: any,
  ) {
    super(context);
  }

  doRun(files?: WatchChangedFile[]): Promise<any> {
    if (typeof this._value === 'function') {
      return this._value(files);
    }
    if (this._value instanceof Error) {
      return Promise.reject(this._value);
    }
    return Promise.resolve(this._value);
  }
}

class MockReporter implements RunnerReporter {
  onRunnerStart = vi.fn();
  onRunnerEnd = vi.fn();
  onStop = vi.fn();
  onStart = vi.fn();
}

const mockContext: TaskRunnerContext = {
  buildTask: {
    name: 'transform-esm',
  },
} as TaskRunnerContext;

it('should initialize with correct distribution of runners', async () => {
  const mockRunner1 = new MockRunner(mockContext, true, 1);
  const mockRunner2 = new MockRunner(mockContext, false, 2);
  const reporter = new MockReporter();

  const scheduler = new RunnerScheduler([mockRunner1, mockRunner2], reporter);
  expect(await scheduler.run()).toEqual([1, 2]);
  expect(reporter.onRunnerStart).toHaveBeenCalledTimes(2);
  expect(reporter.onRunnerEnd).toHaveBeenCalledTimes(2);
  expect(reporter.onStop).toHaveBeenCalledTimes(1);
  expect(reporter.onStart).toHaveBeenCalledTimes(1);
});

it('should call reporter cleanup when runner fails', async () => {
  const failedRunner = new MockRunner(mockContext, false, new Error('boom'));
  const reporter = new MockReporter();

  const scheduler = new RunnerScheduler([failedRunner], reporter);

  await expect(scheduler.run()).rejects.toThrow('boom');
  expect(reporter.onRunnerStart).toHaveBeenCalledTimes(1);
  expect(reporter.onRunnerEnd).toHaveBeenCalledTimes(1);
  expect(reporter.onStop).toHaveBeenCalledTimes(1);
  expect(reporter.onStart).toHaveBeenCalledTimes(1);
});

it('should call onStop after all runners settled when one fails early', async () => {
  const failedRunner = new MockRunner(mockContext, true, new Error('boom'));
  const slowRunner = new MockRunner(
    mockContext,
    true,
    () => new Promise<number>((resolve) => setTimeout(() => resolve(1), 20)),
  );
  const reporter = new MockReporter();

  const scheduler = new RunnerScheduler([failedRunner, slowRunner], reporter);

  await expect(scheduler.run()).rejects.toThrow('boom');
  expect(reporter.onRunnerEnd).toHaveBeenCalledTimes(2);
  expect(reporter.onStop).toHaveBeenCalledTimes(1);

  const stopOrder = reporter.onStop.mock.invocationCallOrder[0];
  const endOrders = reporter.onRunnerEnd.mock.invocationCallOrder;
  expect(stopOrder).toBeGreaterThan(Math.max(...endOrders));
});
