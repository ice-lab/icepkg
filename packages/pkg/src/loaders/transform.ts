import { performance } from 'perf_hooks';
import { isAbsolute, resolve, extname, dirname, relative } from 'path';
import fs from 'fs-extra';
import { loadEntryFiles, loadSource, INCLUDES_UTF8_FILE_TYPE, loadPkg } from '../helpers/load.js';
import { createPluginContainer } from '../helpers/pluginContainer.js';
import { isObject, isDirectory, timeFrom, cwd } from '../utils.js';
import { createLogger } from '../helpers/logger.js';

import type { PkgContext, TransformTaskLoaderConfig, OutputFile, OutputResult } from '../types.js';
import type { SourceMapInput } from 'rollup';

const pkg = loadPkg(cwd);
const isSWCHelpersDeclaredInDependency = Boolean(pkg?.dependencies?.['@swc/helpers']);

export default async function runTransform(config: TransformTaskLoaderConfig, ctx: PkgContext): Promise<OutputResult> {
  let isTransformDistContainingSWCHelpers = false;
  const { rootDir, userConfig } = ctx;
  const { outputDir, entry, rollupPlugins } = config;

  const logger = createLogger(config.name);
  const entryDir = entry;

  let files: OutputFile[];

  if (isDirectory(entry)) {
    files =
      loadEntryFiles(
        resolve(rootDir, entryDir),
        (userConfig?.transform?.excludes || []),
      )
        .map((filePath) => ({
          filePath,
          absolutePath: resolve(rootDir, entryDir, filePath),
          ext: extname(filePath),
        }));
  } else {
    const relativeFilePath = isAbsolute(entry) ? relative(entry, rootDir) : entry;
    files = [{
      filePath: relativeFilePath,
      absolutePath: resolve(rootDir, relativeFilePath),
      ext: extname(relativeFilePath),
    }];
  }

  const container = await createPluginContainer({
    plugins: rollupPlugins,
    root: rootDir,
    output: outputDir,
    logger,
    build: {
      rollupOptions: config,
    },
  });

  const transformStart = performance.now();

  logger.debug('Build start...');

  // @ts-ignore FIXME: ignore
  await container.buildStart(config);

  for (let i = 0; i < files.length; ++i) {
    const traverseFileStart = performance.now();
    const dest = resolve(outputDir, files[i].filePath);
    files[i].dest = dest;

    fs.ensureDirSync(dirname(dest));

    const id = (await container.resolveId(files[i].filePath))?.id || files[i].absolutePath;

    const loadResult = await container.load(id);

    let code: string = null;
    let map: SourceMapInput = null;

    // 除特定类型外，需要用户提供额外的插件的 load 来处理这些文件
    if (loadResult === null && !INCLUDES_UTF8_FILE_TYPE.test(files[i].ext)) {
      // 直接拷贝这些文件
      fs.copyFileSync(files[i].absolutePath, dest);

      logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
      logger.debug(`Copy File ${files[i].absolutePath} to ${dest}`);

      continue;
    }

    if (loadResult === null) {
      code = loadSource(files[i].absolutePath);
      // Need to generate .map ?
    } else if (isObject(loadResult)) {
      code = loadResult.code;
      map = loadResult.map as string;
    }

    const transformResult = await container.transform(code, files[i].absolutePath);

    if (transformResult === null ||
      (isObject(transformResult) && transformResult.code === null)
    ) {
      // 不存在 transform 逻辑，code 保持不变
    } else {
      files[i].code = code = transformResult.code;
      files[i].map = map = transformResult.map;

      const finalExtname = transformResult?.meta?.ext;

      // If extname changed
      if (finalExtname) {
        files[i].dest = (files[i].dest).replace(files[i].ext, finalExtname);
      }
    }

    if (map) {
      const standardizedMap = typeof map === 'string' ? map : JSON.stringify(map);

      fs.writeFileSync(
        files[i].dest,
        `${code}\n //# sourceMappingURL=${files[i].dest}.map`,
        'utf-8',
      );
      fs.writeFileSync(`${files[i].dest}.map`, standardizedMap, 'utf-8');
    } else {
      fs.writeFileSync(files[i].dest, code, 'utf-8');
    }

    if (!isTransformDistContainingSWCHelpers) {
      isTransformDistContainingSWCHelpers = code?.includes('@swc/helpers');
    }

    logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
  }

  await container.close();

  logger.info(`✅ ${timeFrom(transformStart)}`);

  if (isTransformDistContainingSWCHelpers && !isSWCHelpersDeclaredInDependency) {
    logger.error('⚠️ The transformed dist contains @swc/helpers, please run `npm i @swc/helpers -S` command to install it as dependency. See https://pkg.ice.work/guide/abilities for more detail.');
    process.exit(1);
  }

  return {
    outputFiles: files.map((file) => ({ ...file, filename: relative(outputDir, file.dest) })),
    taskName: config.name,
  };
}
