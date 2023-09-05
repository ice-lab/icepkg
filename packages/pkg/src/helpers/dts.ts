import ts from 'typescript';
import consola from 'consola';
import { performance } from 'perf_hooks';
import { timeFrom, normalizePath } from '../utils.js';
import { createLogger } from './logger.js';
import formatAliasToTSPathsConfig from './formatAliasToTSPathsConfig.js';
import type { TaskConfig } from '../types.js';
import { prepareSingleFileReplaceTscAliasPaths } from 'tsc-alias';
import fse from 'fs-extra';
import * as path from 'path';

export type FileExt = 'js' | 'ts' | 'tsx' | 'jsx' | 'mjs' | 'mts';

export interface File {
  filePath: string;
  ext: FileExt;
  srcCode?: string;
}

export interface DtsInputFile extends File {
  dtsContent?: string | null;
  dtsPath?: string;
}

const normalizeDtsInput = (file: File, rootDir: string, outputDir: string): DtsInputFile => {
  const { filePath, ext } = file;
  // https://www.typescriptlang.org/docs/handbook/esm-node.html#new-file-extensions
  // a.js -> a.d.ts
  // a.cjs -> a.d.cts
  // a.mjs -> a.d.mts
  // a.ts -> a.d.ts
  // a.cts -> a.d.cts
  // a.mts -> a.d.mts
  const dtsPath = filePath.replace(path.join(rootDir, 'src'), outputDir).replace(ext, `.d.${/^\.[jt]/.test(ext) ? '' : ext[1]}ts`);
  return {
    ...file,
    dtsPath,
  };
};

interface DtsCompileOptions {

  files: File[];
  alias: TaskConfig['alias'];
  rootDir: string;
  outputDir: string;

}

export async function dtsCompile({ files, alias, rootDir, outputDir }: DtsCompileOptions): Promise<DtsInputFile[]> {
  if (!files.length) {
    return;
  }

  const tsCompilerOptions: ts.CompilerOptions = {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    incremental: true,
    skipLibCheck: true,
    outDir: outputDir,
    rootDir: path.join(rootDir, 'src'),
    paths: formatAliasToTSPathsConfig(alias),
  };

  const logger = createLogger('dts');

  logger.debug('Start Compiling typescript declarations...');

  const dtsCompileStart = performance.now();

  const _files = files
    .map((file) => normalizeDtsInput(file, rootDir, outputDir))
    .map(({ filePath, dtsPath, ...rest }) => ({
      ...rest,
      // Be compatible with Windows env.
      filePath: normalizePath(filePath),
      dtsPath: normalizePath(dtsPath),
    }));

  const dtsFiles = {};

  // Create ts host and custom the writeFile and readFile.
  const host = ts.createCompilerHost(tsCompilerOptions);
  host.writeFile = (fileName, contents) => {
    dtsFiles[fileName] = contents;
  };

  const _readFile = host.readFile;
  // Hijack `readFile` to prevent reading file twice
  host.readFile = (fileName) => {
    const foundItem = files.find((file) => file.filePath === fileName);
    if (foundItem && foundItem.srcCode) {
      return foundItem.srcCode;
    }
    return _readFile(fileName);
  };

  // Create ts program.
  const program = ts.createProgram(
    _files.map(({ filePath }) => filePath),
    tsCompilerOptions,
    host,
  );

  logger.debug(`Initializing program takes ${timeFrom(dtsCompileStart)}`);

  const emitResult = program.emit();

  if (emitResult.diagnostics && emitResult.diagnostics.length > 0) {
    emitResult.diagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        consola.error('DTS', `${diagnostic.file.fileName} (${line + 1}, ${character + 1}): ${message}`);
      } else {
        consola.error('DTS', message);
      }
    });
  }

  // We use tsc-alias to resolve d.ts alias.
  // Reason: https://github.com/microsoft/TypeScript/issues/30952#issuecomment-1114225407
  const tsConfigLocalPath = path.join(rootDir, 'node_modules/pkg/tsconfig.json');
  await fse.ensureFile(tsConfigLocalPath);
  await fse.writeJSON(
    tsConfigLocalPath,
    { compilerOptions: tsCompilerOptions },
  );
  const runFile = await prepareSingleFileReplaceTscAliasPaths({
    configFile: tsConfigLocalPath,
    outDir: outputDir,
  });

  const result = _files.map((file) => ({
    ...file,
    dtsContent: dtsFiles[file.dtsPath] ? runFile({ fileContents: dtsFiles[file.dtsPath], filePath: file.dtsPath }) : '',
  }));

  logger.debug(`Generating declaration files take ${timeFrom(dtsCompileStart)}`);

  return result;
}
