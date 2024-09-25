import { extname, basename, relative, sep } from 'path';
import * as swc from '@swc/core';
import deepmerge from 'deepmerge';
import { isTypescriptOnly } from '../helpers/suffix.js';
import { checkDependencyExists, createScriptsFilter, formatCnpmDepFilepath, getIncludeNodeModuleScripts } from '../utils.js';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';
import type { Options as SwcCompileOptions, Config, TsParserConfig, EsParserConfig } from '@swc/core';
import type { TaskConfig, OutputFile, BundleTaskConfig } from '../types.js';
import type { Plugin } from 'rollup';
import { JSX_RUNTIME_SOURCE } from '../constants.js';


const normalizeSwcConfig = (
  file: OutputFile,
  jsxRuntime: TaskConfig['jsxRuntime'],
  mergeOptions?: SwcCompileOptions,
): SwcCompileOptions => {
  const { filePath, ext } = file;
  const isTypeScript = isTypescriptOnly(ext, filePath);
  const syntaxFeatures = {
    decorators: true,
  };
  const tsSyntaxFeatures: TsParserConfig = {
    syntax: 'typescript',
    tsx: true,
  };
  const jsSyntaxFeatures: EsParserConfig = {
    syntax: 'ecmascript',
    jsx: true,
  };
  const commonOptions: SwcCompileOptions = {
    jsc: {
      transform: {
        react: {
          runtime: jsxRuntime,
          importSource: JSX_RUNTIME_SOURCE,
        },
        legacyDecorator: true,
      },
      parser: {
        ...syntaxFeatures,
        ...(isTypeScript ? tsSyntaxFeatures : jsSyntaxFeatures),
      },
      externalHelpers: false,
      loose: false, // Not recommend
    },
    // Disable minimize on every file transform when bundling
    minify: false,
    swcrc: false,
    configFile: false,
  };

  // For .cts .cjs .mts .mjs, use the specified module type
  function getModuleConfig(fileExt: string, moduleConfig: SwcCompileOptions['module']): SwcCompileOptions['module'] {
    if (['.cts', '.cjs'].includes(fileExt)) {
      return { type: 'commonjs' };
    }
    if (['.mts', '.mjs'].includes(fileExt)) {
      return { type: 'es6' };
    }

    return moduleConfig;
  }

  return deepmerge.all([
    commonOptions,
    mergeOptions,
    {
      module: getModuleConfig(ext, mergeOptions?.module),
    },
  ]);
};

// Transform @swc/helpers to cjs path if in commonjs module.
async function transformImport(source: string, sourceFilename: string) {
  await init;
  const [imports, exports] = await parse(source);
  let s: MagicString | undefined;
  const str = () => {
    if (!s) {
      s = new MagicString(source);
    }
    return s;
  };
  const isESM = exports.length > 0 || imports.some((targetImport) => {
    const importString = targetImport.n;
    // `targetImport.n` get undefined when code has `import.meta.*`.
    return importString && !importString.includes('core-js') && !importString.includes('@swc/helpers');
  });

  imports.forEach((targetImport) => {
    if (!targetImport.n) {
      // If visiting `import.meta.*`, `targetImport.n` will be undefined, that should be ignored.
      return;
    }
    if (targetImport.n.startsWith('@swc/helpers')) {
      if (!isESM) {
        // Replace @swc/helpers with cjs path.
        const importStr = source.substring(targetImport.ss, targetImport.se);
        // Import rule: import { _ as _type_of } from "@swc/helpers/_/_type_of";
        const matchImport = importStr.match(/import\s+{\s+([\w*\s{},]*)\s+}\s+from\s+['"](.*)['"]/);
        if (matchImport) {
          const [, identifier] = matchImport;
          const replaceModule = `var ${identifier.split(' as ')[1].trim()} = require('${targetImport.n.replace(/@swc\/helpers\/_\/(.*)$/,
            (_, matched) => `@swc/helpers/cjs/${matched}.cjs`)}')._`;
          str().overwrite(targetImport.ss, targetImport.se, replaceModule);
        }
      }
    }
  });

  return s ? {
    code: s.toString(),
    map: s.generateMap({
      source: sourceFilename,
      file: `${sourceFilename}.map`,
      includeContent: true,
    }),
  } : {
    code: source,
  };
}

/**
 * plugin-swc works as substitute of plugin-typescript, babel, babel-preset-env and plugin-minify.
 */
const swcPlugin = (
  jsxRuntime: TaskConfig['jsxRuntime'],
  rootDir: string,
  extraSwcOptions?: Config,
  compileDependencies?: BundleTaskConfig['compileDependencies'],
): Plugin => {
  const scriptsFilter = createScriptsFilter(
    getIncludeNodeModuleScripts(compileDependencies),
  );
  return {
    name: 'ice-pkg:swc',

    async transform(source, id) {
      if (!scriptsFilter(formatCnpmDepFilepath(id))) {
        return null;
      }

      const file = {
        filePath: id,
        absolutePath: id,
        ext: extname(id),
      };
      // If file's name comes with .mjs、.mts、.cjs、.cts suffix
      const destExtname = ['m', 'c'].includes(file.ext[1]) ? `.${file.ext[1]}js` : '.js';
      const destFilename = basename(id).replace(RegExp(`${extname(id)}$`), destExtname);
      const sourceFileName = `.${sep}${relative(rootDir, id)}`;

      const { code, map } = await swc.transform(
        source,
        normalizeSwcConfig(file, jsxRuntime, {
          ...extraSwcOptions,
          // If filename is omitted, will lose filename info in sourcemap.
          // e.g: ./src/index.mts
          sourceFileName,
          filename: id,
        }),
      );

      const transformedCode = await transformImport(code, sourceFileName);

      return {
        code: transformedCode.code,
        map: transformedCode.map ?? map,
        meta: {
          filename: destFilename,
        },
      };
    },
    options(options) {
      const { onwarn } = options;
      options.onwarn = (warning, warn) => {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.source.includes(JSX_RUNTIME_SOURCE)) {
          checkDependencyExists(JSX_RUNTIME_SOURCE, 'https://pkg.ice.work/faq');
        }
        if (onwarn) {
          onwarn(warning, warn);
        } else {
          warn(warning);
        }
      };
    },
  };
};

export default swcPlugin;
