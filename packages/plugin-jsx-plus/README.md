# @ice/pkg-plugin-jsx-plus

This plugin adds support for JSX+ syntax for ICE PKG.

## Definition of JSX Plus

https://github.com/jsx-plus/jsx-plus

## Usage

```bash
$ npm i babel-runtime-jsx-plus --save
$ npm i @ice/pkg-plugin-jsx-plus --save-dev
```

```ts
// build.config.mts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    ['@ice/pkg-plugin-jsx-plus'],
  ],
})
```

For more detail, please see https://pkg.ice.work/jsx-plus
