# @ice/remark-react-docgen-docusaurus

组件功能描述

## Install

```bash
$ npm i @ice/remark-react-docgen-docusaurus --save-dev
```

## Usage

First,we need to add the plugin to the config:

If you use it in Docusaurus, add the plugin to the `docusaurus.config.js`:

```js
// docusaurus.config.js
const remarkReactDocgen = require('@ice/remark-react-docgen-docusaurus');

module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          remarkPlugins: [remarkReactDocgen],
        },
      },
    ],
  ],
}
```

If you use it in ICE PKG, add the plugin to the `build.config.mts`:

```ts
// build.config.mts
import { defineConfig } from '@ice/pkg';

export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus',
      {
        remarkPlugins: [
          "require('@ice/remark-react-docgen-docusaurus')",
        ],
      },
    ],
  ],
});
```

Add the `<ReactDocgenProps />` component to the markdown:

```md
## API

<ReactDocgenProps path="../src/components/Button/index.tsx"></ReactDocgenProps>
```

> the path is the path of the React component

Finally, you can run the command `npm run start`, you can see the following:

<img width="553" alt="image" src="https://user-images.githubusercontent.com/44047106/228724542-fa03a49d-da5b-481c-97ea-b0b06e53cb2a.png">
