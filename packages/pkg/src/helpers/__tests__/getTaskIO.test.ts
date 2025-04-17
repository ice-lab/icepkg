import { test, expect } from 'vitest';
import { formatEntry } from '../getTaskIO.js';

test('formatEntry', () => {
  expect(formatEntry('src/index')).toEqual({
    index: 'src/index',
  });

  expect(formatEntry(['src/index', 'src/client'])).toEqual({
    index: 'src/index',
    client: 'src/client',
  });

  expect(
    formatEntry({
      index: 'src/index',
      client: 'src/client',
    }),
  ).toEqual({
    index: 'src/index',
    client: 'src/client',
  });
});
