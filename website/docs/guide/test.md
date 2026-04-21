# 测试

ICE PKG 不耦合任意一个测试框架，开发者可自由选择 [Jest](https://jestjs.io/) 或 [Vitest](https://vitest.dev/) 以及社区其他框架开展单元测试。

## Jest

请先参考 [Jest 官方文档](https://jestjs.io/docs/getting-started)完成基础安装和配置。

### 与 ICE PKG 配置对齐

测试框架直接运行源码，如果 `build.config.mts` 中配置了 `alias` 或 `define`，需要在 Jest 配置中做对应设置。

**alias**：使用 `moduleNameMapper` 映射路径别名：

```js title="jest.config.mjs"
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

**define**：使用 `globals` 定义编译时变量。ICE PKG 默认注入了 `__DEV__` 等变量，测试时需要显式声明：

```js title="jest.config.mjs"
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  globals: {
    __DEV__: true,
  },
};
```

如果你在 `build.config.mts` 中配置了自定义的 `define`，同样需要在此处补充对应的定义。

## Vitest

请先参考 [Vitest 官方文档](https://vitest.dev/guide/)完成基础安装和配置。

### 与 ICE PKG 配置对齐

测试框架直接运行源码，如果 `build.config.mts` 中配置了 `alias` 或 `define`，需要在 Vitest 配置中做对应设置。

**alias**：使用 `resolve.alias` 映射路径别名：

```ts title="vitest.config.mts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
  },
});
```

**define**：使用 `define` 定义编译时变量。ICE PKG 默认注入了 `__DEV__` 等变量，测试时需要显式声明：

```ts title="vitest.config.mts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __DEV__: true,
  },
  test: {
    environment: 'jsdom',
  },
});
```

如果你在 `build.config.mts` 中配置了自定义的 `define`，同样需要在此处补充对应的定义。

### In-source Test

ICE PKG 构建时会将 `import.meta.vitest` 替换为 `undefined`，因此可以直接使用 Vitest 的 [in-source test](https://vitest.dev/guide/in-source.html) 写法，测试逻辑不会被带入最终产物。
