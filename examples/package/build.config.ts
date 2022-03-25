import { defineConfig } from '@ice/pkg-cli';

export default defineConfig({
  minify: false,
  babelPlugins: ['transform-remove-console'],
  plugins: [
    '@ice/pkg-plugin-docusaurus',
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
});
