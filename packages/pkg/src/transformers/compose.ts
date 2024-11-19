import { type SourceMap, SourceMapInput } from 'rollup';
import { swcTransformer, SwcTransformerOptions } from './swc.js';
import { aliasTransformer, AliasTransformerOptions } from './alias.js';
import { babelTransformer, BabelTransformerOptions } from './babel.js';
import { combineSourcemaps } from '../helpers/sourcemap.js';
import { RawSourceMap } from '@ampproject/remapping';

export type CompileTransformer = (code: string, id: string) => Promise<{ code: string, map?: SourceMapInput } | null>
type SourceMapChain = SourceMapInput[]

export function composeTransformer(options: SwcTransformerOptions & AliasTransformerOptions & BabelTransformerOptions & {
  transformers: CompileTransformer[]
}): CompileTransformer {
  const transformers = [
    babelTransformer(options),
    swcTransformer(options),
    ...options.transformers,
    aliasTransformer(options),
  ];
  return async (code, id) => {
    const sourceMapChain: SourceMapChain = [];
    for (const transformer of transformers) {
      const result = await transformer(code, id);
      if (!result) {
        continue;
      }
      code = result.code;
      if (result.map) {
        sourceMapChain.push(result.map);
      }
    }
    return {
      code,
      map: composeSourceMap(sourceMapChain, id),
    };
  };
}

function composeSourceMap(sourcemapChain: SourceMapChain, filename: string) {
  let combinedMap: SourceMap | null = null;
  for (let m of sourcemapChain) {
    if (typeof m === 'string') m = JSON.parse(m);
    if (!('version' in (m as SourceMap))) {
      // empty, nullified source map
      combinedMap = null;
      return combinedMap;
    }
    if (!combinedMap) {
      combinedMap = m as SourceMap;
    } else {
      combinedMap = combineSourcemaps(filename, [
        {
          ...(m as RawSourceMap),
          sourcesContent: combinedMap.sourcesContent,
        },
        combinedMap as RawSourceMap,
      ]) as SourceMap;
    }
  }
  return combinedMap;
}
