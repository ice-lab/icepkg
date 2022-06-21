import type { PkgPlugin } from '@ice/pkg';

const plugin: PkgPlugin = (api) => {
  const { onGetConfig } = api;

  onGetConfig((config) => {
    return {
      ...config,
      swcCompileOptions: {
        jsc: {
          transform: {
            react: {
              // Use classic jsx transform, see https://swc.rs/docs/configuration/compilation#jsctransformreactruntime
              runtime: 'classic',
              pragma: 'createElement',
              pragmaFrag: 'Fragment',
            },
            legacyDecorator: true,
          },
          externalHelpers: false,
          loose: false, // No recommand
        },
      },
    };
  });
};

export default plugin;
