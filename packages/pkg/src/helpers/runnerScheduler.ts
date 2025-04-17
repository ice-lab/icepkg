import { Runner } from './runner.js';
import { WatchChangedFile } from '../types.js';
import { concurrentPromiseAll } from '../utils.js';
import { RunnerReporter } from './runnerReporter.js';

/**
 * To schedule the runner's running.
 *
 * - All parallel runners will be run at the same time.
 * - All concurrent runners will be run by a limit.
 *   The limit is 1 now. Because compiling is cpu heavy task.
 */
export class RunnerScheduler<T> {
  private parallelRunners: Array<Runner<T>> = [];
  private concurrentRunners: Array<Runner<T>> = [];

  constructor(
    public runners: Array<Runner<T>>,
    public reporter: RunnerReporter,
  ) {
    for (const runner of runners) {
      if (runner.isParallel) {
        this.parallelRunners.push(runner);
      } else {
        this.concurrentRunners.push(runner);
      }
      runner.on('status', () => {
        if (runner.isRunning) {
          this.reporter.onRunnerStart?.(runner);
        } else if (runner.isFinished) {
          this.reporter.onRunnerEnd?.(runner);
        }
      });
    }
  }

  async run(changedFiles?: WatchChangedFile[]): Promise<T[]> {
    const startTime = Date.now();
    this.reporter.onStart?.();
    const parallelPromise = Promise.all(this.parallelRunners.map((runner) => runner.run(changedFiles)));
    const concurrentPromise = concurrentPromiseAll(
      this.concurrentRunners.map((runner) => () => runner.run(changedFiles)),
      1,
    );

    const [parallelResults, concurrentResults] = await Promise.all([parallelPromise, concurrentPromise]);
    const stopTime = Date.now();
    this.reporter.onStop?.({
      startTime,
      stopTime,
      cost: stopTime - startTime,
      runners: this.runners,
    });
    return [...parallelResults, ...concurrentResults];
  }
}
