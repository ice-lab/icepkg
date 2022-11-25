import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  plugins: [
    '@ice/pkg-plugin-docusaurus',
    'pkg-plugin-example',
  ],
  bundle: {
    formats: ['esm', 'es2017'],
  },
  alias: {
    '@': './src',
  },
});
