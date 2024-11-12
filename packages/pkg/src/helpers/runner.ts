import { TaskRunnerContext, WatchChangedFile } from '../types.js';
import { TASK_MARK } from './runnerReporter.js';
import { TypedEventEmitter } from '../utils.js';
import { createLogger } from './logger.js';

export enum RunnerStatus {
  Init,
  Running,
  Error,
  Finished,
}

/**
 * The minimal task runner container.
 * It's stores the basic information of a task.
 */
export abstract class Runner<T = unknown> extends TypedEventEmitter<{
  status: RunnerStatus;
  progress: [number, number];
  mark: string;
}> {
  name = this.context.buildTask.name;
  mode = this.context.mode;

  status = RunnerStatus.Init;

  logger = createLogger(`${this.name}-${this.mode}`);

  private taskRunning: Promise<T> | null;

  private metrics: Record<string, number[]> = {};

  // TODO
  private diagnostics: any[] = [];

  private progress: [current: number, total: number] = [-1, -1];

  get isFinished(): boolean {
    return this.status === RunnerStatus.Finished || this.status === RunnerStatus.Error;
  }

  get isError(): boolean {
    return this.status === RunnerStatus.Error;
  }

  get isRunning(): boolean {
    return this.status === RunnerStatus.Running;
  }

  /**
   * Make this runner to run in main thread.
   * Can be changed by override.
   */
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get isParallel() {
    return false;
  }

  constructor(public context: TaskRunnerContext) {
    super();
  }

  abstract doRun(files?: WatchChangedFile[]): Promise<T>;

  async run(files?: WatchChangedFile[]) {
    if (!this.taskRunning) {
      this.metrics = {};
      this.updateStatus(RunnerStatus.Running);
      this.mark(TASK_MARK);
      let running = this.doRun(files);
      running = running.then((data) => {
        this.mark(TASK_MARK);
        this.updateStatus(RunnerStatus.Finished);
        this.taskRunning = null;
        return data;
      }, (e) => {
        this.mark(TASK_MARK);
        this.updateStatus(RunnerStatus.Error);
        this.taskRunning = null;
        // TODO
        throw e;
      });
      this.taskRunning = running;
    }
    return this.taskRunning;
  }

  mark(name: string) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(Date.now());
  }

  getMetrics() {
    return Object.keys(this.metrics).map((name) => this.getMetric(name));
  }

  getMetric(name: string) {
    const times = this.metrics[name] ?? [];
    return {
      name,
      times,
      delta: times.map((time, i) => {
        if (i === 0) {
          return 0;
        }
        return times[i - 1] - time;
      }),
      cost: times.length ? times[times.length - 1] - times[0] : 0,
    };
  }

  updateProgress(current: number, total?: number) {
    this.progress[0] = current;
    this.progress[1] = total ?? this.progress[1];
    this.emit('progress', this.progress);
  }

  getProgress() {
    return this.progress[1] === -1 ? null : this.progress;
  }

  private updateStatus(nextStatus: RunnerStatus) {
    this.status = nextStatus;
    this.emit('status', nextStatus);
  }
}
