import ts from 'typescript';
import consola from 'consola';
import { normalizePath } from '../utils.js';
import { TaskConfig } from '../types.js';
import { prepareSingleFileReplaceTscAliasPaths } from 'tsc-alias';
import fse from 'fs-extra';
import * as path from 'path';
import merge from 'lodash.merge';

export type FileExt = 'js' | 'ts' | 'tsx' | 'jsx' | 'cjs' | 'mjs' | 'mts' | 'cts';

export interface File {
  filePath: string;
  ext: FileExt;
  srcCode?: string;
}

export interface DtsInputFile extends File {
  dtsContent?: string | null;
  dtsPath?: string;
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
  const dtsPath = filePath.replace(path.join(rootDir, 'src'), outputDir).replace(ext, `.d.${/^\.[jt]/.test(ext) ? '' : ext[1]}ts`);
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

  Object.entries(alias || {})
    .forEach(([key, value]) => {
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

async function getTSConfig(
  rootDir: string,
  outputDir: string,
  alias: TaskConfig['alias'],
) {
  const defaultTSCompilerOptions: ts.CompilerOptions = {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    incremental: true,
    skipLibCheck: true,
    paths: formatAliasToTSPathsConfig(alias), // default add alias to paths
  };
  const projectTSConfig = await getProjectTSConfig(rootDir);
  const tsConfig: ts.ParsedCommandLine = merge(
    { options: defaultTSCompilerOptions },
    projectTSConfig,
    {
      options: {
        outDir: outputDir,
        rootDir: path.join(rootDir, 'src'),
      },
    },
  );

  return tsConfig;
}

async function getProjectTSConfig(rootDir: string): Promise<ts.ParsedCommandLine> {
  const tsconfigPath = ts.findConfigFile(rootDir, ts.sys.fileExists);
  if (tsconfigPath) {
    const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    return ts.parseJsonConfigFileContent(
      tsconfigFile.config,
      ts.sys,
      path.dirname(tsconfigPath),
    );
  }

  return {
    options: {},
    fileNames: [],
    errors: [],
  };
}

export async function dtsCompile({ files, rootDir, outputDir, alias, usingOxc }: DtsCompileOptions): Promise<DtsInputFile[]> {
  if (!files.length) {
    return [];
  }

  const tsConfig = await getTSConfig(rootDir, outputDir, alias);

  const _files = files
    .map((file) => normalizeDtsInput(file, rootDir, outputDir))
    .map<DtsInputFile>(({ filePath, dtsPath, ...rest }) => ({
    ...rest,
    // Be compatible with Windows env.
    filePath: normalizePath(filePath),
    dtsPath: normalizePath(dtsPath),
  }));

  const compileFunction = usingOxc ? compileFromOxc : compileFromTsc;
  const dtsFiles = await compileFunction(_files, tsConfig)

  if (!Object.keys(alias).length) {
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
  await fse.writeJSON(tsConfigLocalPath, {
    ...tsConfig,
    compilerOptions: tsConfig.options,
  }, { spaces: 2 });

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

async function compileFromTsc(files: DtsInputFile[], tsConfig: ts.ParsedCommandLine): Promise<Record<string, string>> {
  // In order to only include the update files instead of all the files in the watch mode.
  function getProgramRootNames(originalFilenames: string[]) {
    // Should include all the resolved .d.ts file to avoid dts generate error:
    // TS4025: Exported variable '<name>' has or is using private name '<name>'.
    const dtsFilenames = originalFilenames.filter((filename) => filename.endsWith('.d.ts'));
    const needCompileFileNames = files.map(({ filePath }) => filePath);
    return [...needCompileFileNames, ...dtsFilenames];
  }

  const host = ts.createCompilerHost(tsConfig.options);

  const dtsFiles: Record<string, string> = {};

  host.writeFile = (fileName, contents) => {
    dtsFiles[fileName] = contents;
  };

  const programOptions: ts.CreateProgramOptions = {
    rootNames: getProgramRootNames(tsConfig.fileNames),
    options: tsConfig.options,
    host,
    projectReferences: tsConfig.projectReferences,
    configFileParsingDiagnostics: ts.getConfigFileParsingDiagnostics(tsConfig),
  };
  const program = ts.createProgram(programOptions);

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

  return dtsFiles
}

async function compileFromOxc(absFiles: DtsInputFile[], tsConfig: ts.ParsedCommandLine): Promise<Record<string, string>> {
  if (!tsConfig.options.isolatedDeclarations) {
    consola.warn(`Enable isolatedDeclarations in tsconfig.json for correct .d.ts file generation`)
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

  return dtsFiles
}
