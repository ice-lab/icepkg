const path = require('path');
const webpack = require('webpack');

const raxAliasMap = {
  rax: 'rax-compat',
  'rax-children': 'rax-compat/children',
  'rax-clone-element': 'rax-compat/clone-element',
  'rax-create-class': 'rax-compat/create-class',
  'rax-create-factory': 'rax-compat/create-factory',
  'rax-create-portal': 'rax-compat/create-portal',
  'rax-find-dom-node': 'rax-compat/find-dom-node',
  'rax-is-valid-element': 'rax-compat/is-valid-element',
  'rax-unmount-component-at-node': 'rax-compat/unmount-component-at-node',
};

module.exports = function (context) {
  const { siteDir } = context;

  const requireOptions = { paths: [siteDir, __dirname] };

  const mdxReactPath = require.resolve('@mdx-js/react', requireOptions);

  const styleUnitPath = require.resolve('style-unit', requireOptions);

  const styleRegExpStrs = ['/\\.css$/i', '/\\.module\\.css$/i', '/\\.s[ca]ss$/', '/\\.less$/'];

  const getLoader = (rule, loaderName) => rule.use.find((u) => u.loader.includes(loaderName));

  const insertPostcssPlugin = (rule, pluginName) => {
    const postcssLoader = getLoader(rule, 'postcss-loader');
    postcssLoader?.options.postcssOptions.plugins.push(require.resolve(pluginName));
  };

  const updateLoaderOptions = (rule, loaderName, newOptions) => {
    const loader = getLoader(rule, loaderName);
    if (loader) {
      loader.options = Object.assign({}, loader.options, newOptions);
    }
  };

  return {
    name: 'icepkg:docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      const { getStyleLoaders } = utils;
      const isProd = process.env.NODE_ENV === 'production';

      const cssRules = config.module.rules.filter((rule) => {
        const testRegExpStr = rule.test.toString();
        // eslint-disable-no-useless-escape
        return styleRegExpStrs.includes(testRegExpStr);
      });
      cssRules.forEach((rule) => {
        if (rule.use) {
          insertPostcssPlugin(rule, 'postcss-plugin-rpx2vw');
          updateLoaderOptions(rule, 'mini-css-extract-plugin', { esModule: false });
        } else if (rule.oneOf) {
          rule.oneOf.forEach((o) => {
            if (o.use) {
              insertPostcssPlugin(o, 'postcss-plugin-rpx2vw');
              updateLoaderOptions(o, 'mini-css-extract-plugin', { esModule: false });
            }
          });
        }
      });

      const raxAlias = {};
      try {
        for (const aliasKey in raxAliasMap) {
          const resolvePath = require.resolve(raxAliasMap[aliasKey]);
          raxAlias[aliasKey] = resolvePath;
        }
      } catch (e) {
        /* continue regardless of error */
      }
      return {
        resolve: {
          alias: Object.assign({
            react: path.resolve(siteDir, 'node_modules/react'),
            'react-dom': path.resolve(siteDir, 'node_modules/react-dom'),
            'react/jsx-runtime': path.resolve(siteDir, 'node_modules/react/jsx-runtime'),
            '@mdx-js/react': mdxReactPath,
            'style-unit': styleUnitPath,
          }, raxAlias),
        },
        plugins: [
          new webpack.ProvidePlugin({
            createElement: [path.resolve(siteDir, '.docusaurus', 'hijackCreateElement.js'), 'default'],
            Fragment: ['react', 'Fragment'],
          }),
        ],
        module: {
          rules: [
            // Fork from https://github.com/rlamana/docusaurus-plugin-sass/blob/master/docusaurus-plugin-sass.js
            // Use `require.resolve()` to resolve the sass-loader because it can not be resolved in ICE PKG project.
            {
              test: /\.s[ca]ss$/,
              oneOf: [
                {
                  test: /\.module\.s[ca]ss$/,
                  use: [
                    ...getStyleLoaders(isServer, {
                      modules: {
                        localIdentName: isProd
                          ? '[local]_[hash:base64:4]'
                          : '[local]_[path][name]',
                        exportOnlyLocals: isServer,
                      },
                      importLoaders: 2,
                      sourceMap: !isProd,
                    }), {
                      loader: require.resolve('sass-loader'),
                    },
                  ],
                },
                {
                  use: [
                    ...getStyleLoaders(isServer), {
                      loader: require.resolve('sass-loader'),
                    },
                  ],
                },
              ],
            },
            // Fork from https://github.com/nonoroazoro/docusaurus-plugin-less/blob/master/index.js
            // Use `require.resolve()` to resolve the less-loader because it can not be resolved in ICE PKG project.
            {
              test: /\.less$/,
              oneOf: [
                {
                  test: /\.module\.less$/,
                  use: [
                    ...getStyleLoaders(
                      isServer,
                      {
                        modules: {
                          localIdentName: isProd
                            ? '[sha1:hash:hex:5]'
                            : '[name]_[local]',
                          exportOnlyLocals: isServer,
                        },
                        importLoaders: 1,
                        sourceMap: !isProd,
                      },
                    ),
                    {
                      loader: require.resolve('less-loader'),
                      options: {
                        lessOptions: {
                          javascriptEnabled: true,
                        },
                      },
                    },
                  ],
                },
                {
                  use: [
                    ...getStyleLoaders(isServer),
                    {
                      loader: require.resolve('less-loader'),
                      options: {
                        lessOptions: {
                          javascriptEnabled: true,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
    },
  };
};
