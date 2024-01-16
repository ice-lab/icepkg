import test from 'ava';

import { runTransform } from '../index.js';

test('sum from native', (t) => {
  runTransform({
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
