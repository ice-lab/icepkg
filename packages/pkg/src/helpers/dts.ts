import { consola } from 'consola';
import { normalizePath } from '../utils.js';
import { TaskConfig } from '../types.js';
import { prepareSingleFileReplaceTscAliasPaths } from 'tsc-alias';
import fse from 'fs-extra';
import * as path from 'path';
import { merge } from 'es-toolkit/object';
import { getTsconfig, TsConfigJson } from 'get-tsconfig';
import type ts from 'typescript';

export type FileExt = 'js' | 'ts' | 'tsx' | 'jsx' | 'cjs' | 'mjs' | 'mts' | 'cts';

export interface File {
  filePath: string;
  ext: FileExt;
  srcCode?: string;
}

export interface DtsInputFile extends File {
  dtsContent?: string | null;
  dtsPath: string;
}

const normalizeDtsInput = (filePath: string, rootDir: string, outputDir: string): DtsInputFile => {
  const ext = path.extname(filePath) as FileExt;
  // https://www.typescriptlang.org/docs/handbook/esm-node.html#new-file-extensions
  // a.js -> a.d.ts
  // a.cjs -> a.d.cts
  // a.mjs -> a.d.mts
  // a.ts -> a.d.ts
  // a.cts -> a.d.cts
  // a.mts -> a.d.mts
  const dtsPath = filePath
    .replace(path.join(rootDir, 'src'), outputDir)
    .replace(ext, `.d.${/^\.[jt]/.test(ext) ? '' : ext[1]}ts`);
  return {
    filePath,
    ext,
    dtsPath,
  };
};

export interface DtsCompileOptions {
  // In watch mode, it only contains the updated file names. In build mode, it contains all file names.
  files: string[];
  alias: TaskConfig['alias'];
  rootDir: string;
  outputDir: string;
  usingOxc: boolean;
}

function formatAliasToTSPathsConfig(alias: TaskConfig['alias']) {
  const paths: { [from: string]: [string] } = {};

  Object.entries(alias || {}).forEach(([key, value]) => {
    const [pathKey, pathValue] = formatPath(key, value);
    paths[pathKey] = [pathValue];
  });

  return paths;
}

function formatPath(key: string, value: string) {
  if (key.endsWith('$')) {
    return [key.replace(/\$$/, ''), value];
  }
  // abc -> abc/*
  // abc/ -> abc/*
  return [addWildcard(key), addWildcard(value)];
}

function addWildcard(str: string) {
  return `${str.endsWith('/') ? str : `${str}/`}*`;
}

export async function dtsCompile({
  files,
  rootDir,
  outputDir,
  alias,
  usingOxc,
}: DtsCompileOptions): Promise<DtsInputFile[]> {
  if (!files.length) {
    return [];
  }

  const projectTSConfigResult = getTsconfig(rootDir);

  const defaultTSConfig: TsConfigJson = {
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      incremental: true,
      skipLibCheck: true,
      paths: formatAliasToTSPathsConfig(alias), // default add alias to paths
    },
  };

  const tsConfig: TsConfigJson = merge<TsConfigJson, TsConfigJson>(
    projectTSConfigResult ? merge(defaultTSConfig, projectTSConfigResult.config) : defaultTSConfig,
    {
      compilerOptions: {
        outDir: outputDir,
        rootDir: path.join(rootDir, 'src'),
      },
    },
  );

  const _files = files
    .map((file) => normalizeDtsInput(file, rootDir, outputDir))
    .map<DtsInputFile>(({ filePath, dtsPath, ...rest }) => ({
      ...rest,
      // Be compatible with Windows env.
      filePath: normalizePath(filePath),
      dtsPath: normalizePath(dtsPath),
    }));

  const compileFunction = usingOxc ? compileFromOxc : compileFromTsc;
  const dtsFiles = await compileFunction(_files, tsConfig, projectTSConfigResult?.path);

  if (!alias || !Object.keys(alias).length) {
    // no alias config
    return _files.map((file) => ({
      ...file,
      dtsContent: dtsFiles[file.dtsPath],
    }));
  }

  // We use tsc-alias to resolve d.ts alias.
  // Reason: https://github.com/microsoft/TypeScript/issues/30952#issuecomment-1114225407
  const tsConfigLocalPath = path.join(rootDir, 'node_modules/.cache/ice-pkg/tsconfig.json');
  await fse.ensureFile(tsConfigLocalPath);
  await fse.writeJSON(tsConfigLocalPath, tsConfig, { spaces: 2 });

  const runFile = await prepareSingleFileReplaceTscAliasPaths({
    configFile: tsConfigLocalPath,
    outDir: outputDir,
  });

  const result = _files.map((file) => ({
    ...file,
    dtsContent: dtsFiles[file.dtsPath] ? runFile({ fileContents: dtsFiles[file.dtsPath], filePath: file.dtsPath }) : '',
  }));

  return result;
}

async function compileFromTsc(
  files: DtsInputFile[],
  tsConfig: TsConfigJson,
  configPath?: string,
): Promise<Record<string, string>> {
  // In order to only include the update files instead of all the files in the watch mode.
  function getProgramRootNames(originalFilenames: string[]) {
    // Should include all the resolved .d.ts file to avoid dts generate error:
    // TS4025: Exported variable '<name>' has or is using private name '<name>'.
    const dtsFilenames = originalFilenames.filter((filename) => filename.endsWith('.d.ts'));
    const needCompileFileNames = files.map(({ filePath }) => filePath);
    return [...needCompileFileNames, ...dtsFilenames];
  }

  const ts = await import('typescript');

  const parsedTsConfig: ts.ParsedCommandLine = configPath
    ? ts.parseJsonConfigFileContent(tsConfig, ts.sys, configPath)
    : ({
        ...tsConfig,
        options: tsConfig.compilerOptions,
      } as ts.ParsedCommandLine);

  const host = ts.createCompilerHost(parsedTsConfig.options);

  const dtsFiles: Record<string, string> = {};

  host.writeFile = (fileName, contents) => {
    dtsFiles[fileName] = contents;
  };

  const programOptions: ts.CreateProgramOptions = {
    rootNames: getProgramRootNames(parsedTsConfig.fileNames),
    options: parsedTsConfig.options,
    host,
    projectReferences: parsedTsConfig.projectReferences,
    configFileParsingDiagnostics: ts.getConfigFileParsingDiagnostics(parsedTsConfig),
  };
  const program = ts.createProgram(programOptions);

  const emitResult = program.emit();

  if (emitResult.diagnostics && emitResult.diagnostics.length > 0) {
    emitResult.diagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        consola.error('DTS', `${diagnostic.file.fileName} (${line + 1}, ${character + 1}): ${message}`);
      } else {
        consola.error('DTS', message);
      }
    });
  }

  return dtsFiles;
}

async function compileFromOxc(
  absFiles: DtsInputFile[],
  tsConfig: TsConfigJson,
  configPath?: string,
): Promise<Record<string, string>> {
  if (!tsConfig?.compilerOptions?.isolatedDeclarations) {
    consola.warn(`Enable isolatedDeclarations in tsconfig.json for correct .d.ts file generation`);
  }
  const oxc = await import('oxc-transform');
  const dtsFiles: Record<string, string> = {};
  for (const file of absFiles) {
    const fileContent = fse.readFileSync(file.filePath, 'utf-8');
    const { code } = oxc.isolatedDeclaration(file.filePath, fileContent, {
      sourcemap: false,
    });

    dtsFiles[file.dtsPath] = code;
  }

  return dtsFiles;
}
