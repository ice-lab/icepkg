import * as path from 'path';
import type { OutputAsset as RollupOutputAsset, OutputChunk as RollupOutputChunk } from 'rollup';
import type { OutputFile } from '../../types.js';

type RollupOutputItem = RollupOutputChunk | RollupOutputAsset;

export interface NormalizedRollupOutputItem {
  type: 'chunk' | 'asset';
  fileName: string;
  dest: string;
  absolutePath?: string;
  code?: string | Uint8Array;
  chunk?: RollupOutputChunk;
  asset?: RollupOutputAsset;
}

interface ToOutputFilesOptions {
  map?: (item: NormalizedRollupOutputItem) => Partial<OutputFile>;
}

function normalizeOutputItem(item: RollupOutputItem, distDir: string): NormalizedRollupOutputItem {
  return {
    type: item.type,
    fileName: item.fileName,
    dest: path.join(distDir, item.fileName ?? ''),
    absolutePath: 'facadeModuleId' in item ? (item.facadeModuleId ?? undefined) : undefined,
    code: item.type === 'chunk' ? item.code : item.source,
    chunk: item.type === 'chunk' ? item : undefined,
    asset: item.type === 'asset' ? item : undefined,
  };
}

export function toOutputFile(item: RollupOutputItem, distDir: string, options: ToOutputFilesOptions = {}): OutputFile {
  const normalized = normalizeOutputItem(item, distDir);
  const base: OutputFile = {
    filePath: normalized.fileName,
    absolutePath: normalized.absolutePath,
    ext: path.extname(normalized.fileName),
    dest: normalized.dest,
    filename: normalized.fileName,
    code: normalized.code,
    map: normalized.chunk?.map ?? undefined,
  };
  return {
    ...base,
    ...(options.map?.(normalized) ?? {}),
  };
}

export function toOutputFiles(items: RollupOutputItem[], distDir: string, options: ToOutputFilesOptions = {}) {
  return items.map((item) => toOutputFile(item, distDir, options));
}
