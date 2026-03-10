import { it, expect, beforeAll } from 'vitest';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fse from 'fs-extra';
import fs from 'fs-extra';
import { execSync } from 'node:child_process';
import { EngineType, UserConfig } from '@ice/pkg';
import stringifyJavascript from 'serialize-javascript';

const CHECK_DIRS = ['es2017', 'esm', 'dist', 'cjs'];

export interface ProjectTestUserConfigBase {
  name: string;
  mode?: 'build' | 'start';
  /**
   * How to snapshot file
   * - 'full' - snapshot full file content and folder structure
   * - 'structure' - snapshot folder structure, not file content
   */
  snapshot?: 'full' | 'structure';
  // To custom snapshot folders
  snapshotFolders?: string[];
  skip?: boolean;
  only?: boolean;
}

export interface ProjectTestUserConfigObject extends ProjectTestUserConfigBase {
  config: UserConfig;
  engine?: EngineType[];
}

export interface ProjectTestUserConfigString extends ProjectTestUserConfigBase {
  config: string;
}

export type ProjectTestUserConfig = ProjectTestUserConfigObject | ProjectTestUserConfigString;

export type ProjectTestConfig = Required<ProjectTestUserConfig>;

export type ProjectTestConfigs = ProjectTestUserConfig[];

function isStringUserConfig(config: ProjectTestUserConfig): config is ProjectTestUserConfigString {
  return typeof config.config === 'string';
}

export function runProjectTest(fileUrl: string, userConfigs: ProjectTestUserConfig[]) {
  const projectPath = path.dirname(url.fileURLToPath(fileUrl));

  const configs: ProjectTestConfig[] = [];

  for (const config of userConfigs) {
    const baseConfig: Required<ProjectTestUserConfigBase> = {
      name: config.name,
      mode: config?.mode ?? 'build',
      snapshot: config?.snapshot ?? 'full',
      snapshotFolders: config?.snapshotFolders ?? CHECK_DIRS,
      skip: config.skip ?? false,
      only: config.only ?? false,
    };
    if (isStringUserConfig(config)) {
      configs.push({
        ...baseConfig,
        config: config.config,
      });
    } else {
      configs.push({
        ...baseConfig,
        config: config.config,
        engine: config.engine ?? ['rollup'],
      });
    }
  }

  async function resetProject(config: ProjectTestConfig) {
    for (const dir of config.snapshotFolders) {
      await fse.remove(path.join(projectPath, dir));
    }
  }

  async function runBuild(config: ProjectTestConfig, engine: EngineType) {
    let configPath: string;

    if (typeof config.config === 'string') {
      configPath = config.config;
    } else {
      configPath = 'build.config.for-test.mts';
      const withEngineConfig =
        engine !== 'rollup'
          ? {
              ...config.config,
              bundle: {
                ...config.config.bundle,
                engine,
              },
            }
          : config.config;
      await fse.writeFile(path.join(projectPath, configPath), buildIcePkgConfigScript(withEngineConfig), 'utf8');
    }

    execSync(`./node_modules/.bin/ice-pkg build --config ${configPath}`, {
      stdio: 'pipe',
      cwd: projectPath,
    });
  }

  async function runSnapshot(config: ProjectTestConfig) {
    const { snapshot } = config;
    for (const checkDir of config.snapshotFolders) {
      const receivedPath = path.join(projectPath, checkDir);

      const isReceivedExists = fs.existsSync(receivedPath);

      const folder = isReceivedExists ? await buildFolderStructure(receivedPath) : null;
      expect(folder).toMatchSnapshot(`${checkDir} structure`);

      if (snapshot !== 'structure' && folder) {
        await snapshotFolderContent(projectPath, folder);
      }
    }
  }

  beforeAll(async () => {
    expect(fse.existsSync(projectPath), `Project ${path.basename(projectPath)} is not found`).toBe(true);
  });

  for (const config of configs) {
    const test = config.only ? it.only : config.skip ? it.skip : it;
    const engines = 'engine' in config ? config.engine : (['rollup'] as EngineType[]);
    for (const engine of engines) {
      const name = engine !== 'rollup' ? `${config.name}-${engine}` : config.name;
      test(
        `Run config ${name}`,
        {
          timeout: 30 * 1000,
        },
        async () => {
          await resetProject(config);
          await runBuild(config, engine);
          await runSnapshot(config);
        },
      );
    }
  }
}

interface Folder {
  name: string;
  files: Array<File | Folder>;
}

interface File {
  name: string;
}

async function buildFolderStructure(dir: string): Promise<Folder> {
  const dirname = path.basename(dir);
  const files = await fse.readdir(dir);
  files.sort();

  return {
    name: dirname,
    files: await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fse.stat(filePath);
        if (stat.isFile()) {
          return { name: file };
        }
        return buildFolderStructure(filePath);
      }),
    ),
  };
}

async function snapshotFolderContent(rootDir: string, folder: Folder, parentPath = '') {
  const { name, files } = folder;
  parentPath = path.join(parentPath, name);
  await Promise.all(
    files.map(async (file) => {
      const absPath = path.join(rootDir, parentPath, file.name);
      const relPath = path.join(parentPath, file.name);
      if ('files' in file) {
        await snapshotFolderContent(rootDir, file, parentPath);
      } else {
        const content = await fse.readFile(absPath, 'utf8');
        expect(content).toMatchSnapshot(`file content ${relPath}`);
      }
    }),
  );
}

function buildIcePkgConfigScript(config: UserConfig) {
  return `
import { defineConfig } from '@ice/pkg'

export default defineConfig(${stringifyJavascript(config, { space: 2 })})
  `.trim();
}
