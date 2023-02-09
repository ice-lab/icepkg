import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus'],
    ['@ice/pkg-plugin-jsx-plus'],
  ],
  transform: {
    formats: ['esm', 'es2017'],
  },
  sourceMaps: false,
  bundle: {
    formats: ['esm', 'es2017'],
    minify: false,
    development: true,
  },
  alias: {
    '@': './src',
  },
});
