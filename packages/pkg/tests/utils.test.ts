import { describe, it, expect, vi, Mock } from 'vitest';
import {
  concurrentPromiseAll,
  delay,
  formatCnpmDepFilepath,
  getCompiledFileExt, getIncludeNodeModuleScripts,
} from '../src/utils';
import { createScriptsFilter } from '../src/helpers/filter';

const MOCK_TASK_TIME = 20;

function buildTasks<T extends unknown[]>(values: T) {
  return values.map(value => vi.fn(() => new Promise<T[number]>((resolve, reject) => setTimeout(() => {
    if (value instanceof Error) {
      reject(value)
    } else {
      resolve(value)
    }
  }, MOCK_TASK_TIME))))
}

function taskStatus(tasks: Array<Mock>) {
  return tasks.map(task => task.mock.calls.length)
}

describe('concurrentPromiseAll', () => {
  it('should execute all tasks and return the expected result', async () => {
    const values = [1,2,3]
    const tasks = buildTasks(values);
    const result = await concurrentPromiseAll(tasks);
    expect(result).toEqual(values);
  });

  it('should handle more than maximum concurrency tasks correctly', async () => {
    const values = [1,2,3,4,5,6]
    const tasks = buildTasks(values);
    const resultPromise = concurrentPromiseAll(tasks, 2);
    expect(taskStatus(tasks)).toEqual([1,1,0,0,0,0])
    await delay(MOCK_TASK_TIME)
    expect(taskStatus(tasks)).toEqual([1,1,1,1,0,0])
    const result = await resultPromise
    expect(result).toEqual(values);
  });

  it('should stop execution when an error occurs in one of the tasks', async () => {
    const values = [1, new Error('Task failed'), 3]
    const tasks = buildTasks(values)

    try {
      await concurrentPromiseAll(tasks);
      expect(true).toBeFalsy(); // 应该永远不会到达这里
    } catch (error) {
      expect(error.message).toBe('Task failed');
    }
  });

  it('should return an empty array when given an empty task list', async () => {
    const result = await concurrentPromiseAll([]);
    expect(result).toEqual([]);
  });
});


// 将测试用例转换为使用 it.each 格式
describe('formatCnpmDepFilepath', () => {
  it('should works', () => {
    const cases: [string, string][] = [
      ['/workspace/node_modules/.pnpm/classnames@2.3.2/node_modules/classnames/index.js', '/workspace/node_modules/.pnpm/classnames@2.3.2/node_modules/classnames/index.js'],
      ['/workspace/node_modules/.pnpm/@actions+exec@1.1.1/node_modules/@actions/exec/lib/exec.js', '/workspace/node_modules/.pnpm/@actions+exec@1.1.1/node_modules/@actions/exec/lib/exec.js'],
      ['/workspace/node_modules/_idb@7.1.1@idb/build/index.js', '/workspace/node_modules/idb/build/index.js'],
      ['/workspace/node_modules/_@swc_helpers@0.5.3@@swc/helpers/esm/_extends.js', '/workspace/node_modules/@swc/helpers/esm/_extends.js'],
      ['/workspace/node_modules/idb/build/index.js', '/workspace/node_modules/idb/build/index.js'],
      ['/workspace/node_modules/@ice/idb/build/index.js', '/workspace/node_modules/@ice/idb/build/index.js'],
    ]

    for (const [input, expected] of cases) {
      expect(formatCnpmDepFilepath(input), `${input} to ${expected}`).toBe(expected);
    }
  })
});

describe('getCompiledFileExt', () => {
  it.each<[input: string, expected: string]>([
    // normal
    ['.ts', '.js'],
    ['.js', '.js'],
    // jsx
    ['.tsx', '.jsx'],
    ['.jsx', '.jsx'],
    // module/commonjs
    ['.mts', '.mjs'],
    ['.mjs', '.mjs'],
    ['.cts', '.cjs'],
    ['.cjs', '.cjs'],
    // image
    ['.png', '.png'],
    ['.less', '.less'],
    ['.scss', '.scss'],
    ['.css', '.css'],
  ])(`should compile %s to %s`, (input, expected) => {
    expect(getCompiledFileExt(input)).toBe(expected)
  })
})

describe('scriptFilter', () => {

  it('default createScriptsFilter', async () => {
    const scriptsFilter = createScriptsFilter();
    // The path /w is workspace root
    expect(scriptsFilter('/w/src/a.js')).toBe(true);
    expect(scriptsFilter('/w/src/a/b.js')).toBe(true);
    expect(scriptsFilter('/w/cov/a.js')).toBe(true);

    // Windows path
    expect(scriptsFilter('C:\\w\\src\\a.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\src\\a\\b.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\cov\\a.js')).toBe(true);

    // default exclude node_modules files
    expect(scriptsFilter('/w/node_modules/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/src/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/@ice/app/a.js')).toBe(false);
    // default exclude d.ts
    expect(scriptsFilter('/w/src/a.d.ts')).toBe(false);
    // default exclude some deps
    expect(scriptsFilter('/w/node_modules/@babel/runtime/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/babel-runtime/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/core-js/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/core-js-pure/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/tslib/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/@swc/helpers/a.js')).toBe(false);
  })

  it('createScriptsFilter with compileDependencies true', async () => {
    const scriptsFilter = createScriptsFilter(getIncludeNodeModuleScripts(true));
    // The path /w is workspace root

    // exclude node_modules files
    expect(scriptsFilter('/w/node_modules/lodash/a.js')).toBe(true);
    expect(scriptsFilter('/w/node_modules/@ice/app/a.js')).toBe(true);

    // Windows path
    expect(scriptsFilter('C:\\w\\node_modules\\lodash\\a.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\a.js')).toBe(true);

    // default exclude some deps
    expect(scriptsFilter('/w/node_modules/@babel/runtime/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/babel-runtime/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/core-js/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/core-js-pure/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/tslib/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/@swc/helpers/a.js')).toBe(false);

  })

  it('createScriptsFilter with some compileDependencies', async () => {
    const scriptsFilter = createScriptsFilter(getIncludeNodeModuleScripts(['lodash', '@ice/app']));

    // The path /w is workspace root

    // exclude node_modules files
    expect(scriptsFilter('/w/node_modules/lodash/a.js')).toBe(true);
    expect(scriptsFilter('/w/node_modules/@ice/app/a.js')).toBe(true);
    expect(scriptsFilter('/w/node_modules/@ice/runtime/node_modules/lodash/a.js')).toBe(true);
    expect(scriptsFilter('/w/node_modules/@ice/runtime/node_modules/@ice/app/a.js')).toBe(true);
    expect(scriptsFilter('/w/node_modules/@ice/app/node_modules/rax-compat/index.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/lodash/node_modules/rax-compat/index.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/lodash/node_modules/rax-compat/dist/index.js')).toBe(false);
    // Windows path
    expect(scriptsFilter('C:\\w\\node_modules\\lodash\\a.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\a.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\node_modules\\@ice\\runtime\\node_modules\\lodash\\a.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\node_modules\\@ice\\runtime\\node_modules\\@ice\\app\\a.js')).toBe(true);
    expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\node_modules\\rax-compat\\index.js')).toBe(false);
    expect(scriptsFilter('C:\\w\\node_modules\\@ice\\app\\node_modules\\rax-compat\\dist\\index.js')).toBe(false);

    // default exclude some deps
    expect(scriptsFilter('/w/node_modules/@babel/runtime/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/babel-runtime/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/core-js/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/core-js-pure/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/tslib/a.js')).toBe(false);
    expect(scriptsFilter('/w/node_modules/@swc/helpers/a.js')).toBe(false);
  })
})
