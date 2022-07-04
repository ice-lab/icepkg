// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const extractCode = require('@ice/pkg-plugin-docusaurus/remark/extractCode');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ICE PKG',
  url: 'https://pkg.ice.work',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator: async () => {
            return [
              { type: 'doc', id: 'index' },
              { type: 'doc', id: 'quick-start' },
              { type: 'doc', id: 'guide/config' },
              { type: 'doc', id: 'guide/abilities' },
              { type: 'doc', id: 'guide/preview' },
              {
                type: 'category',
                label: '使用场景',
                collapsed: false,
                items: [
                  { type: 'doc', id: 'scenarios/react' },
                  { type: 'doc', id: 'scenarios/rax' },
                  { type: 'doc', id: 'scenarios/node' },
                  { type: 'doc', id: 'scenarios/web' },
                ],
              },
              {
                type: 'category',
                label: '参阅',
                collapsed: false,
                items: [
                  { type: 'doc', id: 'reference/config-list' },
                  { type: 'doc', id: 'reference/plugins-development' },
                ],
              },
            ];
          },
          remarkPlugins: [
            [extractCode, { mobilePreview: false }],
          ],
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ice-lab/icepkg/tree/main/website/docs/',
        },
        theme: {
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // title: 'ICE PKG',
        logo: {
          alt: 'ICE PKG',
          src: 'https://gw.alicdn.com/imgextra/i2/O1CN01s9pEgU1noKxUm0VRK_!!6000000005136-55-tps-502-132.svg',
        },
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '社区',
            items: [
              {
                label: '社区钉钉群',
                href: 'https://iceworks.oss-cn-hangzhou.aliyuncs.com/assets/images/ice-group.png',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ice-lab/icepkg/issues',
              },
            ],
          },
          {
            title: '生态',
            items: [
              {
                label: '应用框架 ICE 3',
                href: 'https://v3.ice.work/',
              },
              {
                label: '微前端 ICESTARK',
                href: 'https://micro-frontends.ice.work/',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '淘系前端',
                href: 'https://fed.taobao.org/',
              },
              {
                label: 'AppWorks',
                href: 'https://appworks.site',
              },
              {
                label: 'Midway',
                href: 'https://midwayjs.org/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} - Present ICE Team.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
