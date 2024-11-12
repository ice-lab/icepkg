import { expect, it, vi } from 'vitest';
import { Runner } from '../../src/helpers/runner';
import { RunnerScheduler } from '../../src/helpers/runnerScheduler';
import { TaskRunnerContext, WatchChangedFile } from '../../src/types';
import { RunnerReporter } from '../../src/helpers/runnerReporter';

class MockRunner extends Runner {
  get isParallel() {
    return this._isParallel;
  }

  constructor(context: TaskRunnerContext, private _isParallel: boolean, private _value: any) {
    super(context);
  }

  public doRun(files?: WatchChangedFile[]): Promise<any> {
    return Promise.resolve(this._value);
  }
}

class MockReporter implements RunnerReporter {
  onRunnerStart = vi.fn()
  onRunnerEnd = vi.fn()
  onStop = vi.fn()
  onStart = vi.fn()
}

const mockContext: TaskRunnerContext = {
  buildTask: {
    name: 'transform-esm'
  }
} as TaskRunnerContext;

it('should initialize with correct distribution of runners', async () => {
  const mockRunner1 = new MockRunner(mockContext, true, 1);
  const mockRunner2 = new MockRunner(mockContext, false, 2);
  const reporter = new MockReporter();

  const scheduler = new RunnerScheduler([mockRunner1, mockRunner2], reporter);
  expect(await scheduler.run()).toEqual([1, 2])
  expect(reporter.onRunnerStart).toHaveBeenCalledTimes(2);
  expect(reporter.onRunnerEnd).toHaveBeenCalledTimes(2);
  expect(reporter.onStop).toHaveBeenCalledTimes(1);
  expect(reporter.onStart).toHaveBeenCalledTimes(1);
});
