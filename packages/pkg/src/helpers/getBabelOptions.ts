import { TransformOptions } from '@babel/core';
import { JSX_RUNTIME_SOURCE } from '../constants.js';
import { BabelPluginOptions } from '../transformers/babel.js';

function getBabelOptions(
  plugins: babel.PluginItem[],
  options: BabelPluginOptions,
  modifyBabelOptions?: (babelCompileOptions: TransformOptions) => TransformOptions,
) {
  const { pragma = 'React.createElement', pragmaFrag = 'React.Fragment', jsxRuntime = 'automatic' } = options;
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
        jsxRuntime === 'automatic'
          ? {
            runtime: jsxRuntime,
            importSource: JSX_RUNTIME_SOURCE,
          }
          : {
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
