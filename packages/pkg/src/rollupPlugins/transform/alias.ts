/**
 * This plugin is used to handle alias only in transform task
 */
import { isAbsolute, resolve, relative, join, dirname, win32 } from 'path';
import { init, parse } from 'es-module-lexer';
import type { ImportSpecifier } from 'es-module-lexer';
import consola from 'consola';
import MagicString from 'magic-string';
import { scriptsFilter, cwd, normalizeSlashes } from '../../utils.js';


interface AliasPluginOptions {
  alias: Record<string, string>;
}

async function redirectImport(
  code: string,
  imports: readonly ImportSpecifier[],
  aliasRecord: Record<string, string>,
  filePath: string,
): Promise<MagicString> {
  const str: MagicString = new MagicString(code);

  imports.forEach((targetImport) => {
    let absoluteImportPath = '';
    for (const alias in aliasRecord) {
      // prefix
      if (targetImport.n.startsWith(`${alias}/`)) {
        absoluteImportPath = join(aliasRecord[alias], targetImport.n.slice(alias.length + 1));
        break;
      }
      // full path
      if (targetImport.n === alias) {
        absoluteImportPath = aliasRecord[alias];
        break;
      }
    }

    if (absoluteImportPath) {
      const relativePath = relative(dirname(filePath), absoluteImportPath);
      const relativeImportPath = normalizeSlashes(relativePath.startsWith('..') ? relativePath : `./${relativePath}`);
      str.overwrite(targetImport.s, targetImport.e, relativeImportPath);
    }
  });
  return str;
}

const aliasPlugin = (options: AliasPluginOptions = { alias: {} }) => {
  return {
    name: 'ice-pkg:transform-alias',

    async transform(code, id) {
      // only transform source code;
      if (!code || !scriptsFilter(id)) {
        return null;
      }
      const { alias: originalAlias } = options;
      await init;
      let imports: readonly ImportSpecifier[] = [];
      try {
        imports = parse(code)[0];
      } catch (e) {
        consola.error('[parse error]', e);
      }
      if (!imports.length) {
        return {
          code,
          map: null,
        };
      }

      // transform alias to absolute path
      const alias = Object.entries(originalAlias).reduce<typeof originalAlias>(
        (result, [name, target]) => {
          if (!isAbsolute(target)) {
            result[name] = resolve(cwd, target);
          } else {
            result[name] = target;
          }
          return result;
        },
        {},
      );
      const str = await redirectImport(
        code,
        imports,
        alias,
        id,
      );

      return {
        code: str.toString(),
        map: str.generateMap({
          hires: true,
          includeContent: true,
        }),
      };
    },
  };
};

export default aliasPlugin;
