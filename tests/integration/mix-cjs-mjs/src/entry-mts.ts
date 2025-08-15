import { join, extend } from './cjs';

export { join, extend };

export const foo = {
  ...extend({ a: 1 }, { b: 2 }),
};
