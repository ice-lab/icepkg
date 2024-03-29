import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list/
export default defineConfig({
  plugins: [
    '@ice/pkg-plugin-docusaurus',
    '@ice/pkg-plugin-rax-component',
    ['@ice/pkg-plugin-jsx-plus', { moduleName: 'rax' }],
  ],
});
