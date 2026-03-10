import * as path from 'path';
import * as rollup from 'rollup';
import { toArray } from '../../utils.js';
import type {
  OutputAsset as RollupOutputAsset,
  OutputChunk as RollupOutputChunk,
  OutputOptions,
  RollupBuild,
  RollupOptions,
  RollupOutput,
} from 'rollup';
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
    writeResult.output.forEach((chunk: RollupOutputChunk | RollupOutputAsset) => {
      outputFiles.push({
        absolutePath: 'facadeModuleId' in chunk ? chunk.facadeModuleId! : undefined,
        dest: path.join(distDir ?? '', chunk.fileName ?? ''),
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
    outputs.push(writeResult.output);
  }

  return {
    outputs,
    outputFiles,
  };
}
