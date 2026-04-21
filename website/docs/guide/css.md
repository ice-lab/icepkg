# CSS

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 基本用法

比如 `src` 文件夹下存在 `index.tsx` 和 `index.css`，可以直接在 `index.tsx` 引入样式文件。如：

<Tabs>

<TabItem value="index.tsx" label="src/index.tsx">

```tsx
import * as React from 'react';
import './a.css';

export default function Home() {
  return <div className="container"></div>;
}
```

</TabItem>
<TabItem value="index.css" label="src/index.css">

```css
.container {
  color: red;
}
```

</TabItem>
</Tabs>

## 预处理器

ICE PKG 内置支持 `.scss`、`.less`、`.sass` 文件，使用方式与 `.css` 文件保持一致。

在开启 Bundle 模式后，需要安装对应的预处理器依赖：

```bash
# .scss and .sass
npm add -D sass

# .less
npm add -D less
```

## CSS Modules

ICE PKG 也支持 [CSS Modules](https://github.com/css-modules/css-modules)，样式文件需以 `.module.css`、`.module.less` 或 `.module.scss` 结尾。

<Tabs>

<TabItem value="index.tsx" label="src/index.tsx">

```tsx
import styles from './index.module.css';

export default () => (
  <div className={styles.root}>
    <div className={styles.item}>Hello</div>
  </div>
);
```

</TabItem>
<TabItem value="index.module.css" label="src/index.module.css">

```css
.root {
  display: flex;
}
.item {
  color: red;
}
```

</TabItem>
</Tabs>

:::tip
如果你在组件里直接通过 `import './index.css'` 的方式引入样式，样式将会对全局样式造成影响。最好给该组件内所有的 CSS 选择器增加前缀，比如：

```diff
- .container {
+ .rc-container {
  color: red;
}
```

或者你可以直接使用 CSS Modules 直接引入样式。
:::
