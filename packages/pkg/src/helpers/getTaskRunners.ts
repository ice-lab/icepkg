import { BuildTask, Context, type OutputResult, type TaskRunnerContext } from '../types.js';
import { createTransformTask } from '../tasks/transform.js';
import { createBundleTask } from '../tasks/bundle.js';
import { createDeclarationTask } from '../tasks/declaration.js';
import { Runner } from './runner.js';
import { FSWatcher } from 'chokidar';

export function getTaskRunners(
  buildTasks: BuildTask[],
  context: Context,
  watcher?: FSWatcher,
): Array<Runner<OutputResult>> {
  return buildTasks
    .map((buildTask) => {
      const { config } = buildTask;
      switch (config.type) {
        case 'transform': {
          return config.modes.map((mode) => {
            const taskRunnerContext: TaskRunnerContext = { mode, buildTask, buildContext: context, watcher };
            return createTransformTask(taskRunnerContext);
          });
        }
        case 'bundle': {
          return config.modes.map((mode) => {
            const taskRunnerContext: TaskRunnerContext = { mode, buildTask, buildContext: context, watcher };
            return createBundleTask(taskRunnerContext);
          });
        }
        case 'declaration': {
          const taskRunnerContext: TaskRunnerContext = {
            mode: 'production',
            buildTask,
            buildContext: context,
            watcher,
          };
          return createDeclarationTask(taskRunnerContext);
        }
        default: {
          // @ts-expect-error unreachable
          throw new Error(`Unknown task type of ${config.type}`);
        }
      }
    })
    .flat(1);
}
