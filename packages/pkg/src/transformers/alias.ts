import * as path from 'path';
import { init, parse } from 'es-module-lexer';
import consola from 'consola';
import MagicString from 'magic-string';
import type { ImportSpecifier } from 'es-module-lexer';
import { CompileTransformer } from './compose.js';
import { createScriptsFilter } from '../helpers/filter.js';

export interface AliasTransformerOptions {
  rootDir: string;
  alias?: Record<string, string>;
}

// aliasPlugin only available for transform task and ES Module
export function aliasTransformer({ rootDir, alias: originalAlias}: AliasTransformerOptions): CompileTransformer {
  // TODO: use compile deps
  const scriptFilter = createScriptsFilter();
  const isValid = !!originalAlias && Object.keys(originalAlias).length > 0;
  return async (code: string, id: string) => {
    // only transform source code;
    if (!isValid || !scriptFilter(id)) {
      return null;
    }
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

    const alias = resolveAliasConfig(originalAlias, rootDir, id);
    const str: MagicString = new MagicString(code);
    imports.forEach(({ n, s, e }) => {
      const matchedEntry = Object.keys(alias)
        .find((pattern) => matches(pattern, n));
      if (matchedEntry) {
        const updatedId = n.replace(matchedEntry, alias[matchedEntry]);
        str.overwrite(s, e, updatedId);
      }
    });

    return {
      code: str.toString(),
      map: str.generateMap({
        hires: true,
        includeContent: true,
      }),
    };
  }
};

export function matches(pattern: string, importee: string) {
  // empty importee or pattern just return false
  if (!importee || !pattern) {
    return false;
  }
  if (importee.length < pattern.length) {
    return false;
  }
  if (importee === pattern) {
    return true;
  }
  // eslint-disable-next-line prefer-template
  return importee.startsWith(pattern + '/');
}

export function resolveAliasConfig(alias: Record<string, string>, rootDir: string, filePath: string) {
  const newAlias = {};
  Object.keys(alias).forEach((pattern) => {
    const target = alias[pattern];
    newAlias[pattern] = target[0] === '.' ?
      // transform alias relative target to relative to the rootDir
      path.relative(path.dirname(filePath), path.resolve(rootDir, target)).split(path.sep).join('/') || '.' :
      target;
  });

  return newAlias;
}