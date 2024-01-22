import test from 'ava';

import {
  transform,
  doTransform,
} from '../index.js';

test('sum from native', (t) => {
  doTransform({
    rootDir: '/Users/luhc228/workspace/github/icepkg/examples/react-component',
    entryDir: 'src',
    outputDir: './esm',
    mode: 'development',
    taskName: 'esm',
    transformExcludes: ['components/**'],
    transforms: [
      async (err, input) => {
        console.log('code===>', input);
        return { code: 'I am return new code' };
      },
      async (err, input) => {
        console.log('code===>', err, input);
        return { code: `${input.code}111` };
      },
    ],
  });

  // transform('id', 'I am code', null, async (...args) => {
  //   console.log(args);
  //   return {
  //     code: 'I am return new code',
  //   };
  // });

  t.is(1, 1);
});

// wrap a function
// => wrap(async (code, map) => { return { code, map } })
