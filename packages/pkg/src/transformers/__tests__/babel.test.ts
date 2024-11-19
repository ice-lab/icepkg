import { expect, it, describe } from 'vitest';
import { TaskConfig } from '../../types';
import { babelTransformer } from '../babel';

const babelPlugins = [
  'babel-plugin-transform-jsx-list',
  'babel-plugin-transform-jsx-condition',
  'babel-plugin-transform-jsx-memo',
  'babel-plugin-transform-jsx-slot',
  [
    'babel-plugin-transform-jsx-fragment',
    {
      moduleName: 'react',
    },
  ],
  'babel-plugin-transform-jsx-class',
];

function cleanCode(str: string) {
  return str.replace(/\s+/g, '');
}

describe('transform', () => {
  it('w/ automatic jsx runtime', async () => {
    const transformTaskConfig: TaskConfig = {
      babelPlugins,
      jsxRuntime: 'automatic',
      type: 'transform',
    };
    const transform = babelTransformer({
      babelPlugins: transformTaskConfig.babelPlugins!,
      babelOptions: {
        jsxRuntime: transformTaskConfig.jsxRuntime,
        pragma: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragma,
        pragmaFrag: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
      },
    });
    const ret = await transform('<div x-if={false}></div>', 'src/test.tsx');
    expect(cleanCode(ret.code)).toBe(
      cleanCode(`import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
    import { jsx as _jsx } from "@ice/jsx-runtime/jsx-runtime";
    __create_condition__([[() => false, () => _jsx("div", {})]]);`),
    );
  });

  it('w/ classic jsx runtime', async () => {
    const transformTaskConfig: TaskConfig = {
      babelPlugins,
      jsxRuntime: 'classic',
      type: 'transform',
    };
    const transform = babelTransformer({
      babelPlugins: transformTaskConfig.babelPlugins!,
      babelOptions: {
        jsxRuntime: transformTaskConfig.jsxRuntime,
        pragma: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragma,
        pragmaFrag: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
      },
    });
    const ret = await transform('<div x-if={false}></div>', 'src/test.tsx');
    expect(cleanCode(ret.code)).toBe(
      cleanCode(`import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
    __create_condition__([[() => false, () => /*#__PURE__*/React.createElement("div", null)]]);`),
    );
  });
});
