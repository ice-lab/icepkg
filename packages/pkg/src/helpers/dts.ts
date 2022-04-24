import ts from 'typescript';
import consola from 'consola';
import { performance } from 'perf_hooks';
import { timeFrom } from '../utils.js';
import { createLogger } from './logger.js';

export interface File {
  filePath: string;
  ext: 'js' | 'ts' | 'tsx' | 'jsx';
}

const defaultTypescriptOptions = {
  allowJs: true,
  declaration: true,
  emitDeclarationOnly: true,
};

export interface DtsInputFile extends File {
  dtsContent?: string | null;
  dtsPath?: string;
}

const nomalizeDtsInput = (file: File): DtsInputFile => {
  const { filePath, ext } = file;
  const dtsPath = filePath.replace(ext, '.d.ts');
  return {
    ...file,
    dtsPath,
  };
};

export default function dtsCompile(files: File[]): DtsInputFile[] {
  if (!files.length) {
    return;
  }

  const logger = createLogger('dts');
  logger.debug('Start Compiling typescript declations...');
  const dtsCompileStart = performance.now();

  const _files = files.map(nomalizeDtsInput);

  const createdFiles = {};

  const host = ts.createCompilerHost(defaultTypescriptOptions);
  host.writeFile = (fileName, contents) => { createdFiles[fileName] = contents; };

  const program = ts.createProgram(
    _files.map(({ filePath }) => filePath),
    defaultTypescriptOptions,
    host,
  );

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

  logger.debug(timeFrom(dtsCompileStart));

  return _files.map((file) => ({
    ...file,
    dtsContent: createdFiles[file.dtsPath],
  }));
}
