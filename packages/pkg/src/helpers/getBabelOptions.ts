import { TransformOptions } from '@babel/core';
import { BabelPluginOptions } from 'src/rollupPlugins/babel.js';

function getBabelOptions(
  plugins: babel.PluginItem[],
  options: BabelPluginOptions,
  modifyBabelOptions?: (babelCompileOptions: TransformOptions) => TransformOptions,
) {
  const { pragma = 'React.createElement', pragmaFrag = 'React.Fragment' } = options;
  const baseBabelOptions: TransformOptions = {
    babelrc: false,
    configFile: false,
    generatorOpts: {
      decoratorsBeforeExport: true,
    },
    plugins,
    presets: [
      [
        '@babel/preset-typescript',
        {
          jsxPragma: pragma,
          jsxPragmaFrag: pragmaFrag,
        },
      ],
      [
        '@babel/preset-react',
        {
          pragma,
          pragmaFrag,
          throwIfNamespace: false,
        },
      ],
    ],
  };
  return typeof modifyBabelOptions === 'function'
    ? modifyBabelOptions(baseBabelOptions)
    : baseBabelOptions;
}
export default getBabelOptions;
