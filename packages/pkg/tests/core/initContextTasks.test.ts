import { describe, it, expect, beforeEach } from 'vitest';
import { initTask } from '../../src/core/initContextTasks';
import { toFormat } from '../../src/helpers/formats';
import {
  BuildTask,
  BundleTaskConfig,
  BundleUserConfig,
  DeclarationTaskConfig,
  StandardBundleFormatString,
  BundleFormat,
  StandardTransformFormatString,
  TransformTaskConfig,
  UserConfig,
} from '../../src';
import { TaskConfig as _BuildTask } from 'build-scripts';
import { join } from 'node:path';

const MOCK_ROOT = '/mock/root';
let command = 'build';

// Transform Task
function tt(
  format: string,
  standardFormat: StandardTransformFormatString,
  config: Omit<TransformTaskConfig, 'type' | 'format' | 'originalFormat'>,
): BuildTask {
  return {
    name: `transform-${format}`,
    config: {
      type: 'transform',
      format: toFormat(standardFormat),
      originalFormat: format,
      ...config,
    },
    modifyFunctions: [],
  };
}

function bt(
  format: string,
  standardFormat: StandardBundleFormatString[],
  config: Partial<BundleTaskConfig>,
): _BuildTask<BundleTaskConfig> {
  return {
    name: `bundle-${format}`,
    config: {
      type: 'bundle',
      formats: standardFormat.map((std) => toFormat<BundleFormat>(std)),
      ...config,
    },
    modifyFunctions: [],
  };
}

// Declaration Task
function dt(formats: string[], config: Partial<DeclarationTaskConfig>): _BuildTask<DeclarationTaskConfig> {
  return {
    name: `declaration`,
    config: {
      type: 'declaration',
      transformFormats: formats as any,
      ...config,
    },
    modifyFunctions: [],
  };
}

// Context
function c(userConfig: Partial<UserConfig>) {
  return {
    userConfig: {
      plugins: [],
      ...userConfig,
    },
    rootDir: MOCK_ROOT,
    command,
  } as Parameters<typeof initTask>[1];
}

beforeEach(() => {
  command = 'build';
});

describe('initTask', () => {
  describe('entry', () => {
    it('without entry', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {}),
        c({
          entry: 'src/index',
        }),
      );
      expect(task.config.entry).toEqual({
        index: 'src/index',
      });
    });

    it('with entry', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {
          entry: 'src/index2',
        }),
        c({ entry: 'src/index' }),
      );
      expect(task.config.entry).toEqual({
        index2: 'src/index2',
      });
    });
  });

  describe('alias', () => {
    it('without alias', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {}),
        c({
          alias: {
            '@': 'src',
          },
        }),
      );
      expect(task.config.alias).toEqual({
        '@': 'src',
      });
    });

    it('with alias', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {
          alias: {
            '@': 'src2',
          },
        }),
        c({
          alias: {
            '@': 'src',
          },
        }),
      );
      expect(task.config.alias).toEqual({
        '@': 'src2',
      });
    });
  });

  describe('define', () => {
    it('without define', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {}),
        c({
          define: {
            'process.env.NODE_ENV': 'production',
          },
        }),
      );
      expect(task.config.define).toEqual({
        'process.env.NODE_ENV': '"production"',
      });
    });

    it('with define', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {
          define: {
            'process.env.NODE_ENV': 'production',
          },
        }),
        c({
          define: {
            'process.env.NODE_ENV': 'development',
          },
        }),
      );
      expect(task.config.define).toEqual({
        'process.env.NODE_ENV': '"production"',
      });
    });
  });

  describe('sourcemap', () => {
    it('without sourcemap', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {}),
        c({
          sourceMaps: true,
        }),
      );
      expect(task.config.sourcemap).toEqual(true);
    });

    it('with sourcemap', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {
          sourcemap: true,
        }),
        c({
          sourceMaps: false,
        }),
      );
      expect(task.config.sourcemap).toEqual(true);
    });

    it('both no sourcemap', () => {
      for (const [newCommand, expected] of [
        ['build', false],
        ['start', true],
      ] as Array<[string, boolean]>) {
        command = newCommand;
        const task = initTask(tt('esm', 'esm:es5', {}), c({}));
        expect(task.config.sourcemap).toEqual(expected);
      }
    });
  });

  describe('jsxRuntime', () => {
    it('without jsxRuntime', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {}),
        c({
          jsxRuntime: 'automatic',
        }),
      );
      expect(task.config.jsxRuntime).toEqual('automatic');
    });
    it('with jsxRuntime', () => {
      const task = initTask(
        tt('esm', 'esm:es5', {
          jsxRuntime: 'automatic',
        }),
        c({
          jsxRuntime: 'classic',
        }),
      );
      expect(task.config.jsxRuntime).toEqual('automatic');
    });
  });

  describe('transform', () => {
    describe('modes', () => {
      it('default is based on command', () => {
        for (const [newCommand, expected] of [
          ['build', 'production'],
          ['start', 'development'],
          ['test', 'development'],
        ] as Array<[string, string]>) {
          command = newCommand;
          const task = initTask(tt('esm', 'esm:es5', {}), c({}));
          expect((task.config as TransformTaskConfig).modes).toEqual([expected]);
        }
      });

      it('prefer taskConfig', () => {
        const task = initTask(
          tt('esm', 'esm:es5', {
            modes: ['development'],
          }),
          c({}),
        );
        expect((task.config as TransformTaskConfig).modes).toEqual(['development']);
      });
    });

    describe('outputDir', () => {
      it('default based on alias format', () => {
        const task = initTask(tt('esm', 'esm:es5', {}), c({}));
        expect((task.config as TransformTaskConfig).outputDir).toEqual(join(MOCK_ROOT, 'esm'));
      });

      it('default based on standard format', () => {
        const task = initTask(tt('esm:es5', 'esm:es5', {}), c({}));
        expect((task.config as TransformTaskConfig).outputDir).toEqual(join(MOCK_ROOT, 'esm:es5'));
      });

      it('default based on custom format', () => {
        const task = initTask(tt('custom', 'esm:es5', {}), c({}));
        expect((task.config as TransformTaskConfig).outputDir).toEqual(join(MOCK_ROOT, 'custom'));
      });
    });
  });

  describe('bundle', () => {
    describe('modes', () => {
      it('default is based on command', () => {
        for (const [newCommand, expected] of [
          ['build', ['production']],
          ['start', ['development']],
        ] as Array<[string, string[]]>) {
          command = newCommand;
          const task = initTask(bt('esm', ['esm:es5'], {}), c({}));
          expect((task.config as BundleTaskConfig).modes).toEqual(expected);
        }
      });

      it('userConfig is preset', () => {
        const task = initTask(
          bt('esm', ['esm:es5'], {}),
          c({
            bundle: {
              modes: ['development', 'production'],
            },
          }),
        );
        expect((task.config as BundleTaskConfig).modes).toEqual(['development', 'production']);
      });
    });

    describe('outputDir', () => {
      it('use default', () => {
        const task = initTask(bt('esm', ['esm:es5'], {}), c({}));
        expect((task.config as BundleTaskConfig).outputDir).toEqual('dist');
      });

      it('userConfig is preset', () => {
        const task = initTask(
          bt('esm', ['esm:es5'], {}),
          c({
            bundle: {
              outputDir: 'custom',
            },
          }),
        );
        expect((task.config as BundleTaskConfig).outputDir).toEqual('custom');
      });

      it('taskConfig is preset', () => {
        const task = initTask(
          bt('esm', ['esm:es5'], {
            outputDir: 'custom1',
          }),
          c({
            bundle: {
              outputDir: 'custom',
            },
          }),
        );
        expect((task.config as BundleTaskConfig).outputDir).toEqual('custom1');
      });
    });

    describe.skip('swcCompileOptions', () => {});

    describe('minify', () => {
      function minifyFunctionTable(fn: (mode: string, command: string) => any) {
        const table: any[] = [];
        for (const mode of ['development', 'production']) {
          for (const command of ['start', 'build']) {
            table.push(fn(mode, command));
          }
        }
        return table;
      }

      const DEFAULT_TABLE = [false, false, false, true];

      it('using default', () => {
        const task = initTask(bt('esm', ['esm:es5'], {}), c({}));
        expect(minifyFunctionTable((task.config as BundleTaskConfig).jsMinify)).toEqual([false, false, false, true]);
        expect(minifyFunctionTable((task.config as BundleTaskConfig).cssMinify)).toEqual([false, false, false, true]);
      });

      it('boolean', () => {
        for (const value of [true, false]) {
          const task = initTask(
            bt('esm', ['esm:es5'], {}),
            c({
              bundle: {
                minify: value,
              },
            }),
          );
          expect(minifyFunctionTable((task.config as BundleTaskConfig).jsMinify)).toEqual([value, value, value, value]);
          expect(minifyFunctionTable((task.config as BundleTaskConfig).cssMinify)).toEqual([
            value,
            value,
            value,
            value,
          ]);
        }
      });

      it('object as boolean', () => {
        for (const jsValue of [undefined, true, false]) {
          for (const cssValue of [undefined, true, false]) {
            const task = initTask(
              bt('esm', ['esm:es5'], {}),
              c({
                bundle: {
                  minify: {
                    js: jsValue,
                    css: cssValue,
                  },
                },
              }),
            );
            expect(minifyFunctionTable((task.config as BundleTaskConfig).jsMinify)).toEqual(
              jsValue === undefined ? DEFAULT_TABLE : [jsValue, jsValue, jsValue, jsValue],
            );
            expect(minifyFunctionTable((task.config as BundleTaskConfig).cssMinify)).toEqual(
              cssValue === undefined ? DEFAULT_TABLE : [cssValue, cssValue, cssValue, cssValue],
            );
          }
        }
      });
    });

    describe.each<[key: keyof BundleUserConfig, defaultValue: any, validValues: any[]]>([
      ['polyfill', 'usage', [false, 'usage', 'entry']],
      ['compileDependencies', false, [false, true, ['react']]],
      ['externals', undefined, [false, { react: 'React' }]],
      ['browser', undefined, [false, true]],
    ])(`%s`, (key, defaultValue, validValues) => {
      it('using default value', () => {
        const task = initTask(bt('esm', ['esm:es5'], {}), c({}));
        expect((task.config as BundleTaskConfig)[key]).toEqual(defaultValue);
      });

      it(`userConfig is preset`, () => {
        for (const value of validValues) {
          const task = initTask(
            bt('esm', ['esm:es5'], {}),
            c({
              bundle: {
                [key]: value,
              },
            }),
          );
          expect((task.config as BundleTaskConfig)[key]).toEqual(value);
        }
      });

      it(`taskConfig is preset`, () => {
        for (const taskConfigValue of validValues) {
          for (const userConfigValue of validValues) {
            const task = initTask(
              bt('esm', ['esm:es5'], {
                [key]: taskConfigValue,
              }),
              c({
                bundle: {
                  [key]: userConfigValue,
                },
              }),
            );
            expect((task.config as BundleTaskConfig)[key]).toEqual(taskConfigValue);
          }
        }
      });
    });
  });

  describe('declaration', () => {
    const FORMATS = ['esm'];
    describe('outputMode', () => {
      it('userConfig is true', () => {
        const task = initTask(
          dt(FORMATS, {}),
          c({
            declaration: true,
          }),
        );
        expect((task.config as DeclarationTaskConfig).outputMode).toEqual('multi');
      });

      it('userConfig is Object', () => {
        const task = initTask(
          dt(FORMATS, {}),
          c({
            declaration: {
              outputMode: 'unique',
            },
          }),
        );
        expect((task.config as DeclarationTaskConfig).outputMode).toEqual('unique');
      });

      it('taskConfig is present', () => {
        const task = initTask(
          dt(FORMATS, {
            outputMode: 'unique',
          }),
          c({
            declaration: true,
          }),
        );
        expect((task.config as DeclarationTaskConfig).outputMode).toEqual('unique');
      });
    });

    describe.skip('declarationOutputDirs', () => {});
  });
});
