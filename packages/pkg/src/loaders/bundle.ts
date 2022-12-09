import { join } from 'path';
import * as rollup from 'rollup';
import { performance } from 'perf_hooks';
import { toArray, timeFrom } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { BundleTaskLoaderConfig, OutputFile, OutputResult, PkgContext } from '../types.js';
import type { OutputChunk as RollupOutputChunk, OutputAsset as RollupOutputAsset } from 'rollup';

interface RawBuildResult {
  bundle: rollup.RollupBuild;
  outputs: Array<rollup.RollupOutput['output']>;
  outputFiles: OutputFile[];
}

async function runBundle(config: BundleTaskLoaderConfig, ctx: PkgContext): Promise<OutputResult> {
  const { rollupOptions, name } = config;
  const logger = createLogger(name);
  const bundleStart = performance.now();
  const outputs = [];
  const outputFiles = [];
  const modules = [];

  logger.debug('Build start...');

  // Prod build.
  // eslint-disable-next-line no-param-reassign
  config.mode = 'production';
  const buildResult = await rawBuild(rollupOptions);
  buildResult.outputs.forEach((o) => outputs.push(o));
  buildResult.outputFiles.forEach((o) => outputFiles.push(o));
  buildResult.bundle.cache.modules.forEach((o) => modules.push(o));

  // Apply dev build if bundle.development is true.
  if (ctx.userConfig.bundle?.development) {
    // eslint-disable-next-line no-param-reassign,require-atomic-updates
    config.mode = 'development';
    const devBuildResult = await rawBuild(rollupOptions);
    devBuildResult.outputs.forEach((o) => outputs.push(o));
    devBuildResult.outputFiles.forEach((o) => outputFiles.push(o));
    devBuildResult.bundle.cache.modules.forEach((o) => modules.push(o));
  }

  logger.info(`✅ ${timeFrom(bundleStart)}`);

  return {
    taskName: config.name,
    outputFiles,
    outputs,
    modules,
  };
}


async function rawBuild(rollupOptions: rollup.RollupOptions): Promise<RawBuildResult> {
  const bundle = await rollup.rollup(rollupOptions);

  const rollupOutputOptions = toArray(rollupOptions.output);
  const outputFiles: OutputFile[] = [];
  const outputs: Array<rollup.RollupOutput['output']> = [];
  for (let o = 0; o < rollupOutputOptions.length; ++o) {
    // eslint-disable-next-line no-await-in-loop
    const writeResult = await bundle.write(rollupOutputOptions[o]);
    const distDir = rollupOutputOptions[o].dir;
    writeResult.output.forEach((chunk: RollupOutputChunk | RollupOutputAsset) => {
      outputFiles.push({
        absolutePath: chunk['facadeModuleId'],
        dest: join(distDir, chunk.fileName),
        filename: chunk.fileName,
        code: chunk.type === 'chunk' ? chunk.code : chunk.source,
      });
    });
    outputs.push(writeResult.output);
  }

  await bundle.close();
  return {
    bundle,
    outputs,
    outputFiles,
  };
}

export default runBundle;
