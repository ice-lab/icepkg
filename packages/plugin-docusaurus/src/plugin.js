const path = require('path');
const webpack = require('webpack');

const raxAlias = {
  rax: require.resolve('rax-compat'),
  'rax-children': require.resolve('rax-compat/children'),
  'rax-clone-element': require.resolve('rax-compat/clone-element'),
  'rax-create-class': require.resolve('rax-compat/create-class'),
  'rax-create-factory': require.resolve('rax-compat/create-factory'),
  'rax-create-portal': require.resolve('rax-compat/create-portal'),
  'rax-find-dom-node': require.resolve('rax-compat/find-dom-node'),
  'rax-is-valid-element': require.resolve('rax-compat/is-valid-element'),
  'rax-unmount-component-at-node': require.resolve('rax-compat/unmount-component-at-node'),
};

module.exports = function (context) {
  const { siteDir } = context;
  const pkgMeta = require(path.resolve(siteDir, 'package.json'));

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
    name: 'docusaurus-plugin',
    configureWebpack(config) {
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
      return {
        resolve: {
          alias: Object.assign({
            'react/jsx-runtime': path.resolve(siteDir, 'node_modules/react/jsx-runtime'),
            '@mdx-js/react': mdxReactPath,
            'style-unit': styleUnitPath,
            // FIXME: I am not sure how to resolve the actual output folder
            [pkgMeta.name]: path.resolve(siteDir, 'esm/index'),
          }, raxAlias),
        },
        plugins: [
          new webpack.ProvidePlugin({
            createElement: [path.resolve(siteDir, '.docusaurus', 'hijackCreateElement.js'), 'default'],
          }),
        ],
      };
    },
  };
};
