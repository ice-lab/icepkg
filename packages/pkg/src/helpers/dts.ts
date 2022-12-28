import ts from 'typescript';
import consola from 'consola';
import { performance } from 'perf_hooks';
import { timeFrom } from '../utils.js';
import { createLogger } from './logger.js';

export type FileExt = 'js' | 'ts' | 'tsx' | 'jsx' | 'mjs' | 'mts';

export interface File {
  filePath: string;
  ext: FileExt;
  srcCode?: string;
}

const defaultTypescriptOptions = {
  allowJs: true,
  declaration: true,
  incremental: true,
  emitDeclarationOnly: true,
  skipLibCheck: true,
};

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
// ['.ts', '.cts', '.mts', '.js', '.cjs', '.mjs']
export function dtsCompile(files: File[]): DtsInputFile[] {
  if (!files.length) {
    return;
  }

  const logger = createLogger('dts');
  logger.debug('Start Compiling typescript declarations...');
  const dtsCompileStart = performance.now();

  const _files = files.map(normalizeDtsInput);

  const createdFiles = {};

  const host = ts.createCompilerHost(defaultTypescriptOptions);
  host.writeFile = (fileName, contents) => { createdFiles[fileName] = contents; };

  const _readFile = host.readFile;

  // Hijack `readFile` to prevent reading file twice
  host.readFile = (fileName) => {
    const foundItem = files.find((file) => file.filePath === fileName);
    if (foundItem && foundItem.srcCode) {
      return foundItem.srcCode;
    }
    return _readFile(fileName);
  };

  const program = ts.createProgram(
    _files.map(({ filePath }) => filePath),
    defaultTypescriptOptions,
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

  logger.debug(`Generating declaration files take ${timeFrom(dtsCompileStart)}`);

  return _files.map((file) => ({
    ...file,
    dtsContent: createdFiles[file.dtsPath],
  }));
}
