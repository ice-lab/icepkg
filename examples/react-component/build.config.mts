import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-jsx-plus'],
  ],
  transform: {
    formats: ['esm', 'es2017', 'cjs'],
  },
  jsxRuntime: 'classic',
  sourceMaps: false,
  bundle: {
    formats: ['esm', 'es2017'],
  },
  alias: {
    '@': './src',
  },
});
