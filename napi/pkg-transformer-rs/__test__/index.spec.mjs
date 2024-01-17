import test from 'ava';

import { callThreadsafeFunction } from '../index.js';

test('sum from native', (t) => {
  // doTransform({
  //   rootDir: '/Users/luhc228/workspace/github/icepkg/examples/react-component',
  //   entryDir: 'src',
  //   outputDir: './esm',
  //   mode: 'development',
  //   taskName: 'esm',
  //   transformExcludes: ['components/**'],
  //   transforms: [
  //     async (code) => {
  //       console.log('code===>', code);
  //       return { code: 'I am return new code' };
  //     },
  //   ],
  // });
  callThreadsafeFunction(async (...args) => {
    console.log(args);
    return { code: 'I am return new code' };
  });

  t.is(1, 1);
});

// wrap a function
// => wrap(async (code, map) => { return { code, map } })
