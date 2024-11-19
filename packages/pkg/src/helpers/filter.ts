import { createFilter } from '@rollup/pluginutils';

/**
 * default include src/**.m?[jt]sx? but exclude .d.ts file
 *
 * @param extraInclude include other file types
 * @param extraExclude exclude other file types
 *
 * @example exclude node_modules createScriptsFilter([], [/node_modules/])
 */
export const createScriptsFilter = (
  extraIncludes: RegExp[] = [],
  extraExcludes: RegExp[] = [],
) => {
  // Match non node_modules files. In ICEPKG V2, we only compile src/**.m?[jt]sx? files.
  const includes = [/^(?!.*node_modules\/).*\.(?:[cm]?[jt]s|[jt]sx)$/].concat(extraIncludes);

  const notCompiledDeps = ['core-js', 'core-js-pure', 'tslib', '@swc/helpers', '@babel/runtime', 'babel-runtime'];
  const excludes = [/\.d\.ts$/, new RegExp(`node_modules/(${notCompiledDeps.join('|')})`)].concat(extraExcludes);
  return createFilter(includes, excludes);
};
