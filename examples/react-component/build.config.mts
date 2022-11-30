import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  plugins: [
    '@ice/pkg-plugin-docusaurus',
    'pkg-plugin-example',
  ],
  transform: {
    formats: ['esm', 'es2017'],
  },
  sourceMaps: true,
  bundle: {
    formats: ['esm', 'es2017'],
    // minify: false,
  },
  alias: {
    '@': './src',
  },
});
