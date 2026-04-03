import { once } from 'node:events';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import path from 'node:path';
import fs from 'fs-extra';
import { onTestFinished } from 'vitest';

export interface WatchHandle {
  child: ChildProcessWithoutNullStreams;
  getLogs: () => string;
  stop: (options?: { timeout?: number; restore?: boolean }) => Promise<void>;
  restore: () => Promise<void>;
  waitFor: (
    predicate: () => Promise<boolean>,
    errorMessage: string,
    timeout?: number,
    interval?: number,
  ) => Promise<void>;
  waitForFile: (filePath: string, timeout?: number) => Promise<void>;
  waitForMissing: (filePath: string, timeout?: number) => Promise<void>;
  waitForContent: (filePath: string, content: string, timeout?: number) => Promise<void>;
  assertAlive: () => void;
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<void>;
  remove: (filePath: string) => Promise<void>;
  pathExists: (filePath: string) => Promise<boolean>;
}

interface StartWatchOptions {
  cwd: string;
  configPath: string;
  args?: string[];
  watchDir?: string | string[];
  autoStopOnTestFinished?: boolean;
}

export function startWatch({
  cwd,
  configPath,
  args = [],
  watchDir,
  autoStopOnTestFinished = true,
}: StartWatchOptions): WatchHandle {
  const child = spawn('./node_modules/.bin/ice-pkg', ['start', '--config', configPath, ...args], {
    cwd,
    stdio: 'pipe',
  });

  const trackedDirs = (Array.isArray(watchDir) ? watchDir : watchDir ? [watchDir] : [])
    .map((dir) => path.resolve(cwd, dir))
    .sort((a, b) => b.length - a.length);

  const originalSnapshots = new Map<string, { exists: boolean; content?: string }>();

  let logs = '';
  child.stdout.on('data', (chunk) => {
    logs += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    logs += chunk.toString();
  });

  const getLogs = () => logs;

  const normalizePath = (filePath: string) => path.resolve(filePath);

  const isTrackedPath = (filePath: string) => {
    if (!trackedDirs.length) {
      return true;
    }

    const normalizedPath = normalizePath(filePath);
    return trackedDirs.some((dir) => normalizedPath === dir || normalizedPath.startsWith(`${dir}${path.sep}`));
  };

  const saveOriginalSnapshot = async (filePath: string) => {
    const normalizedPath = normalizePath(filePath);
    if (!isTrackedPath(normalizedPath) || originalSnapshots.has(normalizedPath)) {
      return;
    }

    if (await fs.pathExists(normalizedPath)) {
      originalSnapshots.set(normalizedPath, {
        exists: true,
        content: await fs.readFile(normalizedPath, 'utf8'),
      });
      return;
    }

    originalSnapshots.set(normalizedPath, {
      exists: false,
    });
  };

  const assertAlive = () => {
    if (child.exitCode != null) {
      throw new Error(`Watch process exited early with code ${child.exitCode}\n\n${getLogs()}`);
    }
  };

  const waitFor = async (
    predicate: () => Promise<boolean>,
    errorMessage: string,
    timeout = 10 * 1000,
    interval = 100,
  ) => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      assertAlive();
      if (await predicate()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`${errorMessage}\n\nWatch logs:\n${getLogs()}`);
  };

  const restore = async () => {
    const restoreOperations = [...originalSnapshots.entries()].reverse().map(async ([filePath, snapshot]) => {
      if (snapshot.exists) {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, snapshot.content ?? '', 'utf8');
      } else {
        await fs.remove(filePath);
      }
    });

    await Promise.all(restoreOperations);
    originalSnapshots.clear();
  };

  const stop = async ({
    timeout = 2000,
    restore: shouldRestore = true,
  }: { timeout?: number; restore?: boolean } = {}) => {
    if (child.exitCode != null) {
      if (shouldRestore) {
        await restore();
      }
      return;
    }

    child.kill('SIGTERM');
    const result = await Promise.race([
      once(child, 'exit').then(() => 'exited'),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), timeout)),
    ]);

    if (result === 'timeout' && child.exitCode == null) {
      child.kill('SIGKILL');
      await once(child, 'exit');
    }

    if (shouldRestore) {
      await restore();
    }
  };

  const readFile = (filePath: string) => fs.readFile(filePath, 'utf8');
  const writeFile = async (filePath: string, content: string) => {
    await saveOriginalSnapshot(filePath);
    await fs.writeFile(filePath, content, 'utf8');
  };
  const remove = async (filePath: string) => {
    await saveOriginalSnapshot(filePath);
    await fs.remove(filePath);
  };
  const pathExists = (filePath: string) => fs.pathExists(filePath);

  const waitForFile = async (filePath: string, timeout = 10 * 1000) => {
    await waitFor(async () => pathExists(filePath), `Expected file to exist: ${filePath}`, timeout);
  };

  const waitForMissing = async (filePath: string, timeout = 10 * 1000) => {
    await waitFor(async () => !(await pathExists(filePath)), `Expected file to be removed: ${filePath}`, timeout);
  };

  const waitForContent = async (filePath: string, content: string, timeout = 10 * 1000) => {
    await waitFor(
      async () => (await pathExists(filePath)) && (await readFile(filePath)).includes(content),
      `Expected file to contain content: ${filePath}`,
      timeout,
    );
  };

  if (autoStopOnTestFinished) {
    onTestFinished(async () => {
      await stop();
    });
  }

  return {
    child,
    getLogs,
    stop,
    restore,
    waitFor,
    waitForFile,
    waitForMissing,
    waitForContent,
    assertAlive,
    readFile,
    writeFile,
    remove,
    pathExists,
  };
}
