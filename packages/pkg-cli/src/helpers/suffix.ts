export const jsx = ['.jsx', '.tsx'];
export const typescript = ['.ts', '.mts', '.tsx'];
export const declation = ['.d.ts', '.d.js'];
export const ecmascript = ['.mjs', '.js', '.jsx'];

/**
 * Wether is declartion file, checked by filepath
 * @param filePath
 * @returns
 */
export const isDeclaration = (filePath: string) => declation.some((dec) => filePath.includes(dec));

/**
 * Wether is typescript only file, checked by filepath and suffix
 * @param suffix
 * @returns
 */
export const isTypescriptOnly = (
  suffix: string, filePath: string,
) => typescript.includes(suffix) && !isDeclaration(filePath);

/**
 * Wether is ecmascript only file, checked by filepath and suffix
 * @param suffix
 * @param filePath
 * @returns
 */
export const isEcmascriptOnly = (
  suffix: string, filePath: string,
) => ecmascript.includes(suffix) && !isDeclaration(filePath);


/**
 * Wether is [j|t]SX，only need suffix
 * @param suffix
 * @returns
 */
export const isJsx = (suffix: string) => jsx.includes(suffix);
