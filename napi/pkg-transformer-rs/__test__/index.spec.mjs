import test from 'ava';

import { doTransform } from '../index.js';

test('sum from native', (t) => {
  doTransform({
    rootDir: '/Users/luhc228/workspace/github/icepkg/examples/react-component',
    entryDir: 'src',
    outputDir: './esm',
    mode: 'development',
    taskName: 'esm',
    transformExcludes: ['components/**'],
    transforms: [(args) => { console.log(args); }],
  });

  t.is(1, 1);
});
