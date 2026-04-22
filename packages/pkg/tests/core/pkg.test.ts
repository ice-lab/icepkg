import { describe, it, expect } from 'vitest';
import { resolvePackage } from '../../src/core/pkg';
import { Context, UserConfig } from '../../src';

function makeCtx(userConfig: Partial<UserConfig>): Context {
  return {
    userConfig: { plugins: [], ...userConfig },
    rootDir: '/mock',
    command: 'build',
    commandArgs: {},
    extendsPluginAPI: {},
  } as unknown as Context;
}

describe('resolvePackage', () => {
  describe('默认值', () => {
    it('没有任何配置时，默认输出 esm preset', async () => {
      const pkgs = await resolvePackage(makeCtx({}));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ id: 'esm', module: 'esm', target: 'es5' });
      expect(pkgs[0].bundle).toBeFalsy();
    });

    it('transform: {} 没有 formats，默认输出 esm preset', async () => {
      const pkgs = await resolvePackage(makeCtx({ transform: {} }));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ id: 'esm', module: 'esm', target: 'es5' });
    });

    it('bundle: {} 没有 formats，默认输出 esm preset', async () => {
      const pkgs = await resolvePackage(makeCtx({ bundle: {} }));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ id: 'esm', module: 'esm', target: 'es5' });
    });

    it('transform.formats: [] 显式空数组，不触发默认值，输出空数组', async () => {
      const pkgs = await resolvePackage(makeCtx({ transform: { formats: [] } }));
      expect(pkgs).toHaveLength(0);
    });

    it('bundle.formats: [] 显式空数组，不触发默认值，输出空数组', async () => {
      const pkgs = await resolvePackage(makeCtx({ bundle: { formats: [] } }));
      expect(pkgs).toHaveLength(0);
    });
  });

  describe('transform.formats 转换', () => {
    it('transform.formats: ["esm"] 生成 esm+es5 产物', async () => {
      const pkgs = await resolvePackage(makeCtx({ transform: { formats: ['esm'] } }));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ module: 'esm', target: 'es5' });
      expect(pkgs[0].bundle).toBeFalsy();
    });

    it('transform.formats: ["es2017"] 生成 esm+es2017 产物', async () => {
      const pkgs = await resolvePackage(makeCtx({ transform: { formats: ['es2017'] } }));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ module: 'esm', target: 'es2017' });
    });

    it('transform.formats: ["es2022"] 生成 esm+es2022 产物', async () => {
      const pkgs = await resolvePackage(makeCtx({ transform: { formats: ['es2022'] } }));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ module: 'esm', target: 'es2022' });
    });

    it('transform.formats: ["esm", "cjs"] 生成两个产物', async () => {
      const pkgs = await resolvePackage(makeCtx({ transform: { formats: ['esm', 'cjs'] } }));
      expect(pkgs).toHaveLength(2);
      expect(pkgs[0]).toMatchObject({ module: 'esm', target: 'es5' });
      expect(pkgs[1]).toMatchObject({ module: 'cjs', target: 'es5' });
    });
  });

  describe('bundle.formats 转换', () => {
    it('bundle.formats: ["esm"] 生成 bundle esm+es5 产物', async () => {
      const pkgs = await resolvePackage(makeCtx({ bundle: { formats: ['esm'] } }));
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ bundle: true, target: 'es5' });
    });

    it('bundle.formats: ["umd"] 生成 bundle umd 产物', async () => {
      const pkgs = await resolvePackage(makeCtx({ bundle: { formats: ['umd'] } }));
      expect(pkgs).toHaveLength(1);
      // !umd 走 bundleLegacy 路径，legacyModules 记录实际模块列表
      expect(pkgs[0]).toMatchObject({ bundle: true, target: 'es5', legacyModules: ['umd'] });
    });
  });

  describe('pkgs + formats 合并', () => {
    it('pkgs 和 transform.formats 合并', async () => {
      const pkgs = await resolvePackage(
        makeCtx({
          pkgs: ['cjs'],
          transform: { formats: ['esm'] },
        }),
      );
      expect(pkgs).toHaveLength(2);
      expect(pkgs[0]).toMatchObject({ module: 'cjs', target: 'es5' });
      expect(pkgs[1]).toMatchObject({ module: 'esm', target: 'es5' });
    });

    it('pkgs 和 bundle.formats 合并', async () => {
      const pkgs = await resolvePackage(
        makeCtx({
          pkgs: ['esm'],
          bundle: { formats: ['umd'] },
        }),
      );
      expect(pkgs).toHaveLength(2);
      // bundleLegacy 优先处理，排在前面
      expect(pkgs[0]).toMatchObject({ bundle: true, target: 'es5', legacyModules: ['umd'] });
      expect(pkgs[1]).toMatchObject({ module: 'esm', target: 'es5' });
      expect(pkgs[1].bundle).toBeFalsy();
    });
  });

  describe('去重', () => {
    it('pkgs 已有的 preset，transform.formats 重复时去重', async () => {
      const pkgs = await resolvePackage(
        makeCtx({
          pkgs: ['esm'],
          transform: { formats: ['esm', 'cjs'] },
        }),
      );
      expect(pkgs).toHaveLength(2);
      expect(pkgs.filter((p) => p.module === 'esm' && !p.bundle)).toHaveLength(1);
    });

    it('pkgs 已有的 bundle preset，bundle.formats 重复时去重', async () => {
      const pkgs = await resolvePackage(
        makeCtx({
          pkgs: ['!umd'],
          bundle: { formats: ['umd'] },
        }),
      );
      // !umd 已在 pkgs 中，bundle.formats: ['umd'] 产生的 '!umd' 去重后不重复添加
      expect(pkgs).toHaveLength(1);
      expect(pkgs[0]).toMatchObject({ bundle: true, target: 'es5' });
    });
  });
});
