---
sidebar_label: 用法
---

本 Demo 演示一行文字的用法。

```tsx preview
import { createElement } from 'rax';
import ExampleRaxComponent from 'example-rax-component';
import styles from './usage.module.css';

export default function App () {
  return (
    <div className={styles.usageContainer}>
      <ExampleRaxComponent title="XYZ" />
    </div>
  )
}
```
