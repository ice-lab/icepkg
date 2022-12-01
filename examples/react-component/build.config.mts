import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus', {
      // outputDir: './docusaurus-build',
    }],
    'pkg-plugin-example',
  ],
  transform: {
    formats: ['esm', 'es2017'],
    // formats: [],
  },
  sourceMaps: true,
  bundle: {
    formats: ['esm', 'es2017'],
    minify: false,
  },
  alias: {
    '@': './src',
  },
});
