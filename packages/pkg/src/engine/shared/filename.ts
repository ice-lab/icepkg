import { Format, NodeEnvMode } from '../../types.js';

export function getFilenameConfig(format: Format, mode: NodeEnvMode) {
  return {
    js: joinFilenameConfig(format, mode, 'js'),
    css: joinFilenameConfig(format, mode, 'css'),
    asset: joinFilenameConfig(format, mode, `[ext]`),
  };
}

export function joinFilenameConfig(format: Format, mode: NodeEnvMode, ext: string) {
  return ['[name]', format.module, format.target, mode, ext].join('.');
}
