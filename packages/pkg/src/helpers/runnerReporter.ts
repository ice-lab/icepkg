import cliSpinners from 'cli-spinners';
import chalk from 'picocolors';
import figures from 'figures';
import { formatTimeCost } from '../utils.js';
import { Runner, RunnerStatus } from './runner.js';

export const TASK_MARK = 'task';

export interface RunnerReporterStopOptions {
  startTime: number;
  stopTime: number;
  cost: number;
  runners: Runner[];
}

export interface RunnerReporter {
  onRunnerStart?: (runner: Runner) => void;
  onRunnerEnd?: (runner: Runner, error?: any) => void;
  onStart?: () => void;
  onStop?: (options: RunnerReporterStopOptions) => void;
}

export interface RunnerReporterOptions {
  stream?: NodeJS.WriteStream;
}

export class RunnerLinerTerminalReporter implements RunnerReporter {
  private stream: NodeJS.WriteStream;
  private timer: any = null;
  private frame = 0;
  private spinner = cliSpinners.arc;
  private isRendering = false;
  private runningRunners: Runner[] = [];

  constructor(options: RunnerReporterOptions = {}) {
    this.stream = options.stream ?? process.stderr;
  }

  onRunnerStart(runner: Runner) {
    this.runningRunners.push(runner);
  }

  onRunnerEnd(runner: Runner) {
    this.runningRunners.splice(this.runningRunners.indexOf(runner), 1);
    const { status, context } = runner;
    if (status !== RunnerStatus.Finished && status !== RunnerStatus.Error) {
      return;
    }

    const items: string[] = [
      runner.isError ? chalk.red(figures.cross) : chalk.green(figures.tick),
      chalk.cyan(runner.name),
      formatTimeCost(runner.getMetric(TASK_MARK).cost),
    ];

    if (context.mode === 'development') {
      items.push(chalk.red('dev'));
    }

    // remove loading
    this.clear();
    this.stream.write(`  ${items.join(' ')}\n`);
    // resume loading
    this.render();
  }

  onStart() {
    if (this.timer) {
      return;
    }
    this.tick();
  }

  onStop(options: RunnerReporterStopOptions) {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    // 停下来之后进行最后一次更新
    this.clear();
    this.isRendering = false;
    this.stream.write(
      `  ${chalk.blue(figures.info)} Done in ${formatTimeCost(options.cost)} for ${options.runners.length} tasks\n`,
    );
  }

  private clear() {
    const { stream } = this;
    if (stream.isTTY) {
      stream.cursorTo(0);
      stream.clearLine(0);
    }
  }

  private render() {
    this.isRendering = true;
    const { stream } = this;
    if (stream.isTTY) {
      stream.write(this.build());
    }
  }

  private rerender() {
    if (this.isRendering) this.clear();
    this.render();
  }

  private tick() {
    this.rerender();
    this.timer = setTimeout(() => {
      this.tick();
    }, this.spinner.interval);
    this.frame = (this.frame + 1) % this.spinner.frames.length;
  }

  private build() {
    const { runningRunners } = this;
    if (!runningRunners.length) {
      return `  ${chalk.blue(figures.info)} ${chalk.cyan('Waiting...')}`;
    }
    return `  ${chalk.dim(this.spinner.frames[this.frame])} ${chalk.dim('Running...')}`;
  }
}

export class RunnerPlainTextReporter implements RunnerReporter {
  private stream: NodeJS.WriteStream;

  constructor(options: RunnerReporterOptions = {}) {
    this.stream = options.stream ?? process.stderr;
  }

  onRunnerEnd(runner: Runner) {
    const { status, context } = runner;
    if (status !== RunnerStatus.Finished && status !== RunnerStatus.Error) {
      return;
    }

    const items: string[] = [
      runner.isError ? figures.cross : figures.tick,
      runner.name,
      formatTimeCost(runner.getMetric(TASK_MARK).cost, false),
    ];

    if (context.mode === 'development') {
      items.push('dev');
    }

    this.stream.write(`  ${items.join(' ')}\n`);
  }

  onStop(options: RunnerReporterStopOptions) {
    this.stream.write(
      `  ${figures.info} Done in ${formatTimeCost(options.cost, false)} for ${options.runners.length} tasks\n`,
    );
  }
}

export function isTerminalEnvironment(stream: NodeJS.WriteStream = process.stderr) {
  return Boolean(stream.isTTY) && !process.env.CI;
}

export function createRunnerReporter(options: RunnerReporterOptions = {}): RunnerReporter {
  const stream = options.stream ?? process.stderr;
  if (isTerminalEnvironment(stream)) {
    return new RunnerLinerTerminalReporter({ stream });
  }
  return new RunnerPlainTextReporter({ stream });
}
