import type { Plugin } from '@ice/pkg';

const plugin: Plugin = (api) => {
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
              importSource: 'rax',
              pragma: 'createElement',
              pragmaFrag: 'Fragment',
            },
            legacyDecorator: true,
          },
          externalHelpers: true,
          loose: false, // No recommend
        },
      },
    };
  });
};

export default plugin;
