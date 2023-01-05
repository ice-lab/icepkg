import ts from 'typescript';
import consola from 'consola';
import { performance } from 'perf_hooks';
import { timeFrom } from '../utils.js';
import { createLogger } from './logger.js';
import formatAliasToTSPathsConfig from './formatAliasToTSPathsConfig.js';
import type { TaskConfig } from '../types.js';
import tsTransformPaths from '@zerollup/ts-transform-paths';

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

const normalizeDtsInput = (file: File): DtsInputFile => {
  const { filePath, ext } = file;
  // https://www.typescriptlang.org/docs/handbook/esm-node.html#new-file-extensions
  // a.js -> a.d.ts
  // a.cjs -> a.d.cts
  // a.mjs -> a.d.mts
  // a.ts -> a.d.ts
  // a.cts -> a.d.cts
  // a.mts -> a.d.mts
  const dtsPath = filePath.replace(ext, `.d.${/^\.[jt]/.test(ext) ? '' : ext[1]}ts`);
  return {
    ...file,
    dtsPath,
  };
};

export function dtsCompile(files: File[], alias: TaskConfig['alias']): DtsInputFile[] {
  if (!files.length) {
    return;
  }

  const tsCompilerOptions: ts.CompilerOptions = {
    allowJs: true,
    declaration: true,
    incremental: true,
    emitDeclarationOnly: true,
    skipLibCheck: true,
    // jsx: 3,
    lib: ['ES2017', 'DOM'],
    paths: formatAliasToTSPathsConfig(alias),
  };

  const logger = createLogger('dts');

  logger.debug('Start Compiling typescript declarations...');

  const dtsCompileStart = performance.now();

  const _files = files.map(normalizeDtsInput);

  const createdFiles = {};

  // Create ts host and custom the writeFile and readFile.
  const host = ts.createCompilerHost(tsCompilerOptions);
  host.writeFile = (fileName, contents) => {
    createdFiles[fileName] = contents;
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

  const emitResult = program.emit(undefined, undefined, undefined, true, {
    afterDeclarations: [tsTransformPaths(program).afterDeclarations],
  });

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

  logger.debug(`Generating declaration files take ${timeFrom(dtsCompileStart)}`);

  return _files.map((file) => ({
    ...file,
    dtsContent: createdFiles[file.dtsPath],
  }));
}
