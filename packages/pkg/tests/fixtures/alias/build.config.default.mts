import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  transform: {
    formats: ['cjs', 'esm', 'es2017']
  },
  alias: {
    '@': './src'
  },
});
