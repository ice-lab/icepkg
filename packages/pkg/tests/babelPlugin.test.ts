import { expect, it, describe } from 'vitest';
import { TaskConfig } from '../src';
import { default as makeBabelPlugin } from '../src/rollupPlugins/babel';

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
  it('w/ automatic jsx runtime', () => {
    const transformTaskConfig: TaskConfig = {
      babelPlugins,
      jsxRuntime: 'automatic',
      type: 'transform',
    };
    const babelPlugin = makeBabelPlugin(transformTaskConfig.babelPlugins!, {
      jsxRuntime: transformTaskConfig.jsxRuntime,
      pragma: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragma,
      pragmaFrag: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
    });
    expect(babelPlugin.name).toBe('ice-pkg:babel');
    // @ts-ignore it's callable
    const ret = babelPlugin.transform('<div x-if={false}></div>', 'test.tsx');
    expect(cleanCode(ret.code)).toBe(
      cleanCode(`import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
    import { jsx as _jsx } from "react/jsx-runtime";
    __create_condition__([[() => false, () => /*#__PURE__*/_jsx("div", {})]]);`),
    );
  });

  it('w/ classic jsx runtime', () => {
    const transformTaskConfig: TaskConfig = {
      babelPlugins,
      jsxRuntime: 'classic',
      type: 'transform',
    };
    const babelPlugin = makeBabelPlugin(transformTaskConfig.babelPlugins!, {
      jsxRuntime: transformTaskConfig.jsxRuntime,
      pragma: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragma,
      pragmaFrag: transformTaskConfig.swcCompileOptions?.jsc?.transform?.react?.pragmaFrag,
    });
    expect(babelPlugin.name).toBe('ice-pkg:babel');
    // @ts-ignore it's callable
    const ret = babelPlugin.transform('<div x-if={false}></div>', 'test.tsx');
    expect(cleanCode(ret.code)).toBe(
      cleanCode(`import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
    __create_condition__([[() => false, () => /*#__PURE__*/React.createElement("div", null)]]);`),
    );
  });
});
