# 测试

<details open>
  <summary>示例</summary>
  <ul>
    <li>
      <a href="https://github.com/ice-lab/icepkg/tree/main/examples/react-component" target="_blank" rel="noopener noreferrer">
        react-component
      </a>
    </li>
    <li>
      <a href="https://github.com/ice-lab/icepkg/tree/main/examples/rax-component" target="_blank" rel="noopener noreferrer">
        rax-component
      </a>
    </li>
  </ul>
</details>

ICE PKG 不耦合任意一个测试框架，开发者可自由选择。目前提供开箱即用 [Jest](https://jestjs.io/) 和 [Vitest](https://vitest.dev/) 配置，以便快速开始单元测试。

## Jest

### 安装依赖

```bash
$ npm i jest ts-jest -D
```

### 配置

首先需要在项目的根目录下新建 `jest.config.mts` 文件，并加入以下内容：

```js
import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
  // 你也可以使用 @swc/jest 编译 TS 代码
  preset: 'ts-jest',
});
```

`defineJestConfig()` 方法返回的是 ice.js 默认配置好的 Jest 配置，支持在第二个参数中传入自定义的 [Jest 配置](https://jestjs.io/docs/configuration)，第二个参数的类型是：

```ts
type UserJestConfig = jest.Config | () => Promise<jest.Config>
```

以添加 `@swc/jest` 为例：

```js title="jest.config.mts"
import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
  transform: {
   '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  }
});
```

然后在 `package.json` 中加入 `test` 脚本：

```diff
{
  "scripts": {
+   "test": "jest"
  }
}
```

### 编写测试用例

#### 非 UI 测试

假设现在要测试 `add()` 函数如下：

```ts title="src/utils/add.ts"
export default function add(a, b) {
  return a + b;
}
```

新建一个测试用例：

```ts title="tests/add.spec.ts"
import add from '../src/add';

test('add function', () => {
  expect(add(1, 2)).toBe(3);
});
```
这时，运行 `npm run test` 查看测试结果了。

#### UI 测试

组件 UI 测试推荐使用 [@testing-library/react](https://www.npmjs.com/package/@testing-library/react) 和 [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom)。

首先安装依赖：
```bash
$ npm i @testing-library/react jest-environment-jsdom @testing-library/jest-dom -D
```
然后在项目根目录下新建 `jest-setup.ts` 并写入以下内容，以扩展匹配器(matchers)：
```ts title="jest-setup.ts"
import '@testing-library/jest-dom';
```
最后在 `jest.config.mjs` 中加入以下内容：

```diff title="jest.config.mts"
import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
+ setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
+ testEnvironment: 'jest-environment-jsdom',
});
```
假设现在要测试一个 Header 组件：
```tsx title="src/components/Header.tsx"
export default function Header() {
  return (
    <h2 data-testid="title">Jest Test</h2>
  );
}
```

编写组件的测试用例：
```tsx title="tests/Header.spec.tsx"
import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header';

test('test Header component', () => {
  render(<Header />);
  expect(screen.getByTestId('title')).toHaveTextContent('Jest Test');
});
```

最后，运行 `npm run test` 就可以查看测试结果了。

## Vitest

### 安装依赖

```bash
$ npm i vitest -D
```

### 配置
首先需要在项目的根目录下新建 `vitest.config.mts` 文件，并加入以下内容：

```js title="vitest.config.mts"
import pkgService, { defineVitestConfig } from '@ice/pkg';

export default defineVitestConfig(pkgService, {});
```
`defineVitestConfig()` 方法返回的是 ice.js 默认配置好的 vitest 配置，支持传入自定义的 [vitest 配置](https://vitest.dev/config/)。

defineVitestConfig 第二个入参支持以下三种类型：

- `vitest.UserConfig`
- `Promise<vitest.UserConfig>`
- `(env) => Promise<vitest.UserConfig>`

以修改 `include` 参数为例：

```diff title="vitest.config.mts"
import pkgService, { defineVitestConfig } from '@ice/pkg';

export default defineVitestConfig(pkgService, {
+ test: {
+   include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
+ }
});
```
然后在 `package.json` 中加入 `test` 脚本：

```diff title="package.json"
{
  "scripts": {
+   "test": "vitest"
  }
}
```

### 编写测试用例

#### 非 UI 测试

请见 [Jest 非 UI 测试章节](#非-ui-测试)。

首先安装依赖：

```bash
$ npm i @testing-library/react jsdom @testing-library/jest-dom -D
```

然后在项目根目录下新建 `vitest-setup.ts` 并写入以下内容，以扩展匹配器(matchers)：

```ts title="vitest-setup.ts"
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);
```

最后在 `vitest.config.mts` 中加入以下内容：

```diff title="vitest.config.mts"
import pkgService, { defineVitestConfig } from '@ice/pkg';

export default defineVitestConfig(pkgService, {
+ test: {
+   environment: 'jsdom',
+   setupFiles: ['./vitest-setup.ts'],
+ },
});
```

假设现在测试一个 Header 组件：

```tsx title="src/components/Header.tsx"
export default function Header() {
  return (
    <h2 data-testid="title">Vitest Test</h2>
  );
}
```

编写组件的测试用例：

```tsx title="tests/Header.spec.tsx"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header';

test('test Header component', () => {
  render(<Header />);
  expect(screen.getByTestId('title')).toHaveTextContent('Vitest Test');
});
```

最后，运行 `npm run test` 就可以查看测试结果了。
