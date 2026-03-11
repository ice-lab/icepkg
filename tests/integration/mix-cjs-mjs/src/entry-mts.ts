import { add, extend } from './cjs';
import { ctsFile } from './cts-file.cjs';

export { add, extend };
export { ctsFile };

export const foo: Record<string, any> = {
  ...extend({ a: 1 }, { b: 2 }),
};
