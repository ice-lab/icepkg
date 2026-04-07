import * as rollup from 'rollup';
import { toArray } from '../../utils.js';
import { toOutputFiles } from './output.js';
import type { OutputOptions, RollupBuild, RollupOptions, RollupOutput } from 'rollup';
import type { OutputFile, OutputResult, TaskRunnerContext } from '../../types.js';

export async function build(rollupOptions: RollupOptions, taskRunnerContext: TaskRunnerContext): Promise<OutputResult> {
  const rollupOutputOptions = toArray(rollupOptions.output);
  const { buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;

  const bundle = await rollup.rollup(rollupOptions);

  const buildResult = await writeFiles(
    (rollupOutputOptions as OutputOptions[]).filter(Boolean),
    bundle.write.bind(bundle),
  );

  await bundle.close();

  return {
    taskName,
    modules: bundle.cache?.modules,
    ...buildResult,
  };
}

export async function writeFiles(
  rollupOutputOptions: OutputOptions[],
  write: RollupBuild['write'],
): Promise<Omit<OutputResult, 'taskName' | 'modules'>> {
  const outputFiles: OutputFile[] = [];
  const outputs: Array<RollupOutput['output']> = [];

  for (let o = 0; o < rollupOutputOptions.length; ++o) {
    const writeResult = await write(rollupOutputOptions[o]);
    const distDir = rollupOutputOptions[o].dir ?? '';
    outputFiles.push(...toOutputFiles(writeResult.output, distDir));
    outputs.push(writeResult.output);
  }

  return {
    outputs,
    outputFiles,
  };
}
