# 测试

ICE PKG 不耦合任意一个测试框架，开发者可自由选择 [Jest](https://jestjs.io/) 或 [Vitest](https://vitest.dev/) 开展单元测试。

## 相关链接

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [Vitest 官方文档](https://vitest.dev/guide/)
- [ts-jest 配置指南](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)
- [@swc/jest](https://www.npmjs.com/package/@swc/jest)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)

## Jest

### 安装依赖

```bash
$ npm i jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom -D
```

### 配置

快速开始时，可以先在项目根目录创建 `jest.config.mjs`：

```js title="jest.config.mjs"
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};
```

再创建 `jest-setup.ts`：

```ts title="jest-setup.ts"
import '@testing-library/jest-dom';
```

并在 `package.json` 中添加脚本：

```diff title="package.json"
{
  "scripts": {
+   "test": "jest"
  }
}
```

如果你希望改用 `@swc/jest` 编译 TS/TSX，可以改成：

```js title="jest.config.mjs"
export default {
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
  },
};
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

组件 UI 测试推荐使用 [@testing-library/react](https://www.npmjs.com/package/@testing-library/react) 和 [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom)。上面的快速开始配置已经包含这两个库常用的 jsdom 环境和 matcher 设置。

假设现在要测试一个 Header 组件：

```tsx title="src/components/Header.tsx"
export default function Header() {
  return <h2 data-testid="title">Jest Test</h2>;
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
$ npm i vitest jsdom @testing-library/react @testing-library/jest-dom -D
```

### 配置

快速开始时，可以先在项目根目录创建 `vitest.config.mts`：

```js title="vitest.config.mts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    globals: true,
  },
});
```

默认情况下，ICE PKG 构建时会将 `import.meta.vitest` 替换为 `undefined`，因此可以直接使用 Vitest 的 in-source test 写法，而不会把测试分支带入最终产物。

再创建 `vitest-setup.ts`：

```ts title="vitest-setup.ts"
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);
```

并在 `package.json` 中添加脚本：

```diff title="package.json"
{
  "scripts": {
+   "test": "vitest"
  }
}
```

可直接传入 [vitest 配置](https://vitest.dev/config/)。

以修改 `include` 参数为例：

```diff title="vitest.config.mts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
+ test: {
+   environment: 'jsdom',
+   setupFiles: ['./vitest-setup.ts'],
+   globals: true,
+   include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
+ },
});
```

### 编写测试用例

#### 非 UI 测试

请见 [Jest 非 UI 测试章节](#非-ui-测试)。

组件 UI 测试时，上面的快速开始配置已经包含 jsdom 环境、全局 API 和 matcher 扩展。

假设现在测试一个 Header 组件：

```tsx title="src/components/Header.tsx"
export default function Header() {
  return <h2 data-testid="title">Vitest Test</h2>;
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
