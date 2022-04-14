import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus', {
      navBarTitle: 'ICE-PKG',
      sidebarItemsGenerator: async (props) => {
        return [
          {type: 'doc', id: 'index'},
          {type: 'doc', id: 'quick-start'},
          {
            type: 'category',
            label: '指南',
            items: [
              {type: 'doc', id: 'guide/config-file'},
              {type: 'doc', id: 'guide/abilities'},
              {type: 'doc', id: 'guide/preview'},
            ],
          },
          {
            type: 'category',
            label: '使用场景',
            items: [
              {type: 'doc', id: 'scenarios/component'},
              {type: 'doc', id: 'scenarios/node'},
              {type: 'doc', id: 'scenarios/library'},
            ],
          },
          {
            type: 'category',
            label: '参阅',
            items: [
              {type: 'doc', id: 'reference/config-list'},
              {type: 'doc', id: 'reference/plugins-development'},
            ],
          },
        ]
      }
    }],
  ],
});
