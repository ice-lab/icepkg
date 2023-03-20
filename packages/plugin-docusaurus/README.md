# @ice/pkg-plugin-docusaurus

This plugin supports component and docs preview for ICE PKG.

## Usage

```bash
$ npm i @ice/pkg-plugin-docusaurus --save-dev
```

```ts
// build.config.mts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-docusaurus'],
  ],
})
```

For more detail, please see https://pkg.ice.work/guide/preview
