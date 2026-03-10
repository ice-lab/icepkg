import { builtinNodeModules } from './builtinModules.js';
import { BundleTaskConfig, PackageJson } from '../../types.js';

export const BUILTIN_EXTERNAL_MAP: Record<string, string[]> = {
  'builtin:normal': ['core-js', 'regenerator-runtime'],
  'builtin:node': builtinNodeModules,
};

export function getExternalsAndGlobals(
  bundleTaskConfig: BundleTaskConfig,
  pkg: PackageJson,
): [(id: string) => boolean, Record<string, string>] {
  // TODO: unique externals after all pushed
  const exactExternals: string[] = [];
  const regexpExternals: RegExp[] = [];
  const globals: Record<string, string> = {};

  const userExternals = bundleTaskConfig.externals ?? false;

  if (userExternals === true) {
    exactExternals.push(
      ...BUILTIN_EXTERNAL_MAP['builtin:normal'],
      ...BUILTIN_EXTERNAL_MAP['builtin:node'],
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    );
  } else if (userExternals === false) {
    // do nothing
  } else if (Array.isArray(userExternals)) {
    for (const item of userExternals) {
      if (typeof item === 'string') {
        if (item in BUILTIN_EXTERNAL_MAP) {
          exactExternals.push(...BUILTIN_EXTERNAL_MAP[item]);
        } else {
          exactExternals.push(item);
        }
      } else if (item instanceof RegExp) {
        regexpExternals.push(item);
      } else if (typeof item === 'object') {
        exactExternals.push(...Object.keys(item));
        Object.assign(globals, item);
      }
    }
  } else if (typeof userExternals === 'object') {
    exactExternals.push(...Object.keys(userExternals));
    Object.assign(globals, userExternals);
  }

  const externalFun =
    !exactExternals.length && !regexpExternals.length
      ? () => false
      : (id: string) => exactExternals.includes(id) || regexpExternals.some((reg) => reg.test(id));

  return [externalFun, globals];
}
