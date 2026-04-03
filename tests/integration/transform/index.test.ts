import { runProjectTest } from '../../helpers/run';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';
import { startWatch } from '../../helpers/watch';
import type { TransformUserFormat } from '../../../packages/pkg/src/types';

const projectPath = path.dirname(fileURLToPath(import.meta.url));

const baseConfig = {
  declaration: false,
  sourceMaps: false,
  transform: {
    formats: ['esm'] as TransformUserFormat[],
  },
};

runProjectTest(import.meta.url, [
  {
    name: 'copy-non-script-files',
    config: {
      ...baseConfig,
      entry: './src/main.ts',
    },
    snapshot: 'full',
    snapshotFolders: ['esm'],
  },
  {
    name: 'multi-entry',
    config: {
      ...baseConfig,
      entry: {
        a: './src/main.ts',
        b: './src-multi-right/entry.ts',
      },
    },
    snapshot: 'structure',
    snapshotFolders: ['esm'],
  },
  {
    name: 'entry-root-wide',
    config: {
      ...baseConfig,
      entry: './src/main.ts',
      transform: {
        ...baseConfig.transform,
        entryRoot: './',
      },
    },
    snapshot: 'structure',
    snapshotFolders: ['esm'],
  },
  {
    name: 'excludes',
    config: {
      ...baseConfig,
      entry: './src/main.ts',
      transform: {
        ...baseConfig.transform,
        excludes: ['**/*.ignore.txt', 'docs/**'],
      },
    },
    snapshot: 'structure',
    snapshotFolders: ['esm'],
  },
  {
    name: 'pkg',
    config: {
      declaration: false,
      sourceMaps: false,
      pkgs: [
        {
          id: 'pkg-override',
          module: 'esm',
          target: 'es5',
          entry: './src/main.ts',
          entryRoot: './src',
          outputDir: 'esm',
        },
      ],
    },
    snapshot: 'structure',
    snapshotFolders: ['esm'],
  },
]);

test(
  'transform watch handles update create delete incrementally',
  {
    timeout: 30 * 1000,
  },
  async () => {
    const outputDir = path.join(projectPath, 'esm');
    const srcMainPath = path.join(projectPath, 'src/main.ts');
    const srcReadmePath = path.join(projectPath, 'src/docs/readme.md');
    const createdSourcePath = path.join(projectPath, 'src/docs/watch-created.txt');
    const createdOutputPath = path.join(outputDir, 'src/docs/watch-created.txt');
    const entryOutputPath = path.join(outputDir, 'src-multi-right/entry.js');
    const labelOutputPath = path.join(outputDir, 'src-multi-right/nested/label.js');
    const mainOutputPath = path.join(outputDir, 'src/main.js');
    const readmeOutputPath = path.join(outputDir, 'src/docs/readme.md');

    const watch = startWatch({
      cwd: projectPath,
      configPath: 'build.config.watch-test.mts',
      watchDir: ['src', 'src-multi-right'],
    });

    const originalMain = await watch.readFile(srcMainPath);
    await watch.readFile(srcReadmePath);

    await watch.remove(outputDir);
    await watch.remove(createdSourcePath);

    // Wait for initial watch build to finish and baseline outputs to appear.
    await watch.waitForFile(entryOutputPath);
    await watch.waitForFile(labelOutputPath);
    await watch.waitForFile(mainOutputPath);
    await watch.waitForFile(readmeOutputPath);

    // 1) Update a src script file and assert src-multi-right outputs do not change.
    const entryContentBeforeUpdate = await watch.readFile(entryOutputPath);
    const labelContentBeforeUpdate = await watch.readFile(labelOutputPath);

    await watch.writeFile(srcMainPath, `${originalMain}\nexport const watchOnlyUpdate = 'watch-update';\n`);

    await watch.waitForContent(mainOutputPath, "watchOnlyUpdate = 'watch-update'");

    expect(await watch.readFile(entryOutputPath)).toBe(entryContentBeforeUpdate);
    expect(await watch.readFile(labelOutputPath)).toBe(labelContentBeforeUpdate);

    // 2) Create a src static file and assert it is copied without touching src-multi-right output.
    const entryContentBeforeCreate = await watch.readFile(entryOutputPath);

    await watch.writeFile(createdSourcePath, 'created during watch\n');

    await watch.waitForFile(createdOutputPath);
    expect(await watch.readFile(createdOutputPath)).toBe('created during watch\n');
    expect(await watch.readFile(entryOutputPath)).toBe(entryContentBeforeCreate);

    // 3) Delete a src static file and assert output is removed without touching src-multi-right output.
    const entryContentBeforeDelete = await watch.readFile(entryOutputPath);

    await watch.remove(srcReadmePath);

    await watch.waitForMissing(readmeOutputPath);
    expect(await watch.readFile(entryOutputPath)).toBe(entryContentBeforeDelete);
  },
);
