import { defineConfig } from '@ice/pkg';

export default defineConfig({
  declaration: false,
  sourceMaps: false,
  entry: {
    a: './src/main.ts',
    b: './src-multi-right/entry.ts',
  },
  transform: {
    formats: ['esm'],
    excludes: ['**/*.ignore.txt'],
  },
});