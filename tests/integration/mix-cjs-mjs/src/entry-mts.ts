import { add, extend } from './cjs';

export { add, extend };

export const foo: Record<string, any> = {
  ...extend({ a: 1 }, { b: 2 }),
};
