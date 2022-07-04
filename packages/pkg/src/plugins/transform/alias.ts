/**
 * This plugin is used to handle alias only in transform task
 */
import { init, parse } from 'es-module-lexer';
import type { ImportSpecifier } from 'es-module-lexer';
import consola from 'consola';
import MagicString from 'magic-string';
import { scriptsFilter } from '../../utils.js';


interface AliasPluginOptions {
  alias: Record<string, string>;
}

async function redirectImport(
  code: string,
  imports: readonly ImportSpecifier[],
  aliasObject: Record<string, string>,
): Promise<MagicString> {
  const str: MagicString = new MagicString(code);

  imports.forEach((targetImport) => {
    if (targetImport.n in aliasObject) {
      str.overwrite(targetImport.s, targetImport.e, aliasObject[targetImport.n]);
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
      const { alias } = options;
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
      const str = await redirectImport(
        code,
        imports,
        alias,
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
