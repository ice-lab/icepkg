# @ice/pkg-plugin-mf

ICE PKG plugin for Module Federation builds.

## Usage

```bash
npm i @ice/pkg-plugin-mf -D
```

```ts
// build.config.mts
import { defineConfig } from '@ice/pkg';
import { mf } from '@ice/pkg-plugin-mf';

export default defineConfig({
  pkgs: [
    {
      module: 'mf',
      target: 'es2017',
      plugins: [
        mf({
          name: 'my_remote',
          exposes: {
            '.': './src/index.ts',
            './Counter': './src/Counter.tsx',
          },
          getPublicPath: 'return "http://localhost:4444/"',
          shared: {},
        }),
      ],
    },
  ],
});
```

More: https://pkg.ice.work/guide/mf
