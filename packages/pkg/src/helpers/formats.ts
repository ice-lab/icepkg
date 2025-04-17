import { StandardFormatString, Format, ModuleType, JsTarget } from '../types.js';
import { ALL_FORMAT_MODULES, ALL_FORMAT_TARGET } from '../constants.js';

export function toFormat<T extends Format>(format: StandardFormatString): T {
  const [module, target] = format.split(':');

  return {
    module,
    target,
  } as unknown as T;
}

export function createFormat<M extends ModuleType, T extends JsTarget>(module: M, target: T): Format<M, T> {
  return { module, target };
}

export function tryToFormat<T extends Format>(format: string): T | null {
  const [module, target] = format.split(':');
  if (
    module &&
    target &&
    ALL_FORMAT_MODULES.includes(module as ModuleType) &&
    ALL_FORMAT_TARGET.includes(target as JsTarget)
  ) {
    return {
      module,
      target,
    } as unknown as T;
  }
  return null;
}

export function isAliasFormatString<T extends string>(format: string, alias: Record<T, string>): format is T {
  return format in alias;
}
