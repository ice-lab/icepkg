export const jsx = ['.jsx', '.tsx'];
export const typescript = ['.ts', '.mts', '.cts', '.tsx'];
export const declaration = ['.d.ts', '.d.mts', '.d.cjs'];
export const ecmascript = ['.js', '.mjs', '.cjs', '.jsx'];

/**
 * Wether is declaration file, checked by filepath
 * @param filePath
 * @returns
 */
export const isDeclaration = (filePath: string) => declaration.some((dec) => filePath.endsWith(dec));

/**
 * Wether is typescript only file, checked by filepath and suffix
 * @param suffix
 * @returns
 */
export const isTypescriptOnly = (suffix: string, filePath: string) =>
  typescript.includes(suffix) && !isDeclaration(filePath);

/**
 * Wether is ecmascript only file, checked by filepath and suffix
 * @param suffix
 * @param filePath
 * @returns
 */
export const isEcmascriptOnly = (suffix: string, filePath: string) =>
  ecmascript.includes(suffix) && !isDeclaration(filePath);

/**
 * Wether is [j|t]SX，only need suffix
 * @param suffix
 * @returns
 */
export const isJsx = (suffix: string) => jsx.includes(suffix);
