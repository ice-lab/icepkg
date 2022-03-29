import { defineConfig } from '@ice/pkg-cli';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus', {
      navBarTitle: 'PKG-CLI',
      sidebarItemsGenerator: () => [],
    }],
  ],
});
