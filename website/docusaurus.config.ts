import { themes } from 'prism-react-renderer';
import { Config } from '@docusaurus/types';
import path from 'path';

const config: Config = {
  title: 'ICE PKG',
  url: 'https://pkg.ice.work',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: path.resolve('./sidebars.js'),
          sidebarItemsGenerator: async () => {
            return [
              { type: 'doc', id: 'index' },
              { type: 'doc', id: 'quick-start' },
              { type: 'doc', id: 'guide/abilities' },
              { type: 'doc', id: 'guide/scenarios' },
              { type: 'doc', id: 'guide/build' },
              { type: 'doc', id: 'guide/publish' },
              { type: 'doc', id: 'guide/test' },
              { type: 'doc', id: 'guide/preview' },
              { type: 'doc', id: 'guide/jsx-plus' },
              { type: 'doc', id: 'guide/monorepo' },
              {
                type: 'category',
                label: '参考',
                items: [
                  { type: 'doc', id: 'reference/cli' },
                  { type: 'doc', id: 'reference/config' },
                  { type: 'doc', id: 'reference/plugins-development' },
                ],
              },
              { type: 'doc', id: 'faq', label: '常见问题' },
            ];
          },
          routeBasePath: '/',
          editUrl: 'https://github.com/ice-lab/icepkg/tree/main/website/docs',
        },
        blog: false,
        theme: {},
      },
    ],
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themeConfig: {
    navbar: {
      logo: {
        alt: 'ICE PKG',
        src: 'https://gw.alicdn.com/imgextra/i2/O1CN01s9pEgU1noKxUm0VRK_!!6000000005136-55-tps-502-132.svg',
      },
      items: [
        { type: 'search', position: 'right' },
        {
          label: '生态',
          position: 'right',
          items: [
            { label: '应用研发框架 ICE', to: 'https://v3.ice.work/' },
            { label: '微前端 ICESTARK', to: 'https://micro-frontends.ice.work/' },
            { label: '可视化工具 AppWorks', to: 'https://appworks.site/' },
            { label: '前端环境 AppToolkit', to: 'https://github.com/appworks-lab/toolkit#readme' },
          ],
        },
        {
          label: '资源',
          position: 'right',
          items: [
            { to: 'https://fusion.design/pc/doc/component/102', label: 'Fusion 组件' },
            { to: 'https://ant.design', label: 'Antd 组件' },
            { label: '社区钉钉群', to: 'https://iceworks.oss-cn-hangzhou.aliyuncs.com/assets/images/ice-group.png' },
          ],
        },
        { href: 'https://github.com/ice-lab/icepkg', label: 'GitHub', position: 'right' },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: '社区',
          items: [
            { label: '社区钉钉群', href: 'https://iceworks.oss-cn-hangzhou.aliyuncs.com/assets/images/ice-group.png' },
            { label: 'GitHub', href: 'https://github.com/ice-lab/icepkg/issues' },
          ],
        },
        {
          title: '生态',
          items: [
            { label: '应用框架 ICE 3', href: 'https://v3.ice.work/' },
            { label: '微前端 ICESTARK', href: 'https://micro-frontends.ice.work/' },
          ],
        },
        {
          title: '更多',
          items: [
            { label: '淘系前端', href: 'https://fed.taobao.org/' },
            { label: 'AppWorks', href: 'https://appworks.site' },
            { label: 'Midway', href: 'https://midwayjs.org/' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} - Present ICE Team.`,
    },

    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
    },
  },

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        docsRouteBasePath: '/',
      },
    ],
  ],
};

export default config;
