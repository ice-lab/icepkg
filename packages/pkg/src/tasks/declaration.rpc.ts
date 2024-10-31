import type { DtsCompileOptions } from '../helpers/dts.js';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type DeclarationMainMethods = {
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type DeclarationWorkerMethods = {
  /**
   * @param outputDirs 输出到的目录，支持多个目录
   * @param options 编译配置，这里面的 outputDir 没有任何用处
   */
  run: (outputDirs: string[], options: DtsCompileOptions) => Promise<void>;
};
