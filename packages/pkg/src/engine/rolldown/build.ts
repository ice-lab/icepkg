import type { OutputFile, OutputResult, TaskRunnerContext } from '../../types.js';
import { BuildOptions, build as rolldownBuild } from 'rolldown';

export async function build(options: BuildOptions[], taskRunnerContext: TaskRunnerContext): Promise<OutputResult> {
  const { buildTask } = taskRunnerContext;
  const { name: taskName } = buildTask;

  const outputs = await rolldownBuild(options);

  const outputFiles: OutputFile[] = [];

  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    output.output.forEach((chunk) => {
      outputFiles.push({
        absolutePath: 'facadeModuleId' in chunk ? chunk.facadeModuleId! : undefined,
        // dest: path.join(distDir ?? '', chunk.fileName ?? ''),
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
  }

  return {
    taskName,
    // modules: outputs.cache?.modules,
    // TODO: correct type
    outputs: outputs.map((o) => o.output) as any[],
    outputFiles,
  };
}
