import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus', {
      mobilePreview: true,
    }],
    // './plugin.js',
  ],
  sourceMaps: true,
  define: {
    __buildVersion: '0.1.2',
    __buildNumber: 15,
    __buildObject: {
      a: '2',
    },
  },
  transform: {
    excludes: '**/test/*',
  },
  bundle: {
    development: true,
    formats: ['esm', 'es2017'],
    externals: true,
  },
});
