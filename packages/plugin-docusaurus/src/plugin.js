const path = require('path');
const webpack = require('webpack');

module.exports = function (context) {
  const { siteDir } = context;
  const pkgMeta = require(path.resolve(siteDir, 'package.json'));

  const requireOptions = { paths: [siteDir, __dirname] };

  const mdxReactPath = require.resolve('@mdx-js/react', requireOptions);

  const styleUnitPath = require.resolve('style-unit', requireOptions);

  return {
    name: 'docusaurus-plugin',
    configureWebpack(config) {
      const cssRules = config.module.rules.filter((rule) => {
        const testRegExpStr = rule.test.toString();
        // eslint-disable-no-useless-escape
        return testRegExpStr === '/\\.css$/i' || testRegExpStr === '/\\.module\\.css$/i';
      });
      cssRules.forEach((rule) => {
        const postcssUse = rule.use.find((u) => u.loader.includes('postcss-loader'));
        if (postcssUse) {
          postcssUse.options.postcssOptions.plugins.push(require.resolve('postcss-plugin-rpx2vw'));
        }
      });
      return {
        resolve: {
          alias: {
            'react/jsx-runtime': path.resolve(siteDir, 'node_modules/react/jsx-runtime'),
            '@mdx-js/react': mdxReactPath,
            'style-unit': styleUnitPath,
            // FIXME: I am not sure how to resolve the actual output folder
            [pkgMeta.name]: path.resolve(siteDir, 'esm/index'),
          },
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
