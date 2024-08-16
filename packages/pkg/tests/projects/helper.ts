import { it, beforeEach, expect, beforeAll } from 'vitest'
import * as path from 'node:path'
import * as url from "node:url";
import * as fse from 'fs-extra'
import fs from "fs-extra";
import { execSync, spawn } from 'node:child_process'
import { UserConfig } from '../../src'

const fixturesDir = path.join(url.fileURLToPath(import.meta.url), '../../fixtures')

const CHECK_DIRS = ['es2017', 'esm', 'dist', 'cjs']

export interface ProjectTestUserConfig {
  name: string,
  config?: string | UserConfig
  mode?: 'build' | 'start'
  snapshot?: 'full' | 'structure'
  skip?: boolean
  only?: boolean
}

export interface ProjectTestConfig extends Required<ProjectTestUserConfig> {
}

export type ProjectTestConfigs = ProjectTestUserConfig[]

export function runProjectTest(name: string, userConfigs: ProjectTestConfigs) {
  const projectPath = path.join(fixturesDir, name)

  const configs: ProjectTestConfig[] = []

  for (const userConfig of userConfigs) {
    let config: ProjectTestUserConfig

    if (typeof userConfig === 'string') {
      config = {name: userConfig}
    } else {
      config = userConfig
    }

    configs.push({
      name: config.name,
      config: config.config,
      mode: config?.mode ?? 'build',
      snapshot: config?.snapshot ?? 'full',
      skip: config.skip ?? false,
      only: config.only ?? false,
    })
  }

  async function resetProject() {
    for (const dir of CHECK_DIRS) {
      await fse.remove(path.join(projectPath, dir))
    }
  }

  async function runBuild(config: ProjectTestConfig) {
    let configPath: string

    if (typeof config.config === 'string') {
      configPath = config.config
    } else {
      configPath = 'build.config.for-test.mts'
      await fse.writeFile(path.join(projectPath, configPath), buildIcePkgConfigScript(config.config), 'utf8')
    }

    const { mode } = config

    execSync(`./node_modules/.bin/ice-pkg build --config ${configPath}`, {
      stdio: 'inherit',
      cwd: projectPath,
    })
  }

  async function runSnapshot(config: ProjectTestConfig) {
    const { name: configName, snapshot} = config
    for (const checkDir of CHECK_DIRS) {
      const receivedPath = path.join(projectPath, checkDir)

      const isReceivedExists = fs.existsSync(receivedPath)

      const folder = isReceivedExists ? await buildFolderStructure(receivedPath) : null
      expect(folder).toMatchSnapshot(`${checkDir} structure`)

      if (snapshot !== 'structure' && folder) {
        await snapshotFolderContent(projectPath, folder)
      }
    }
  }

  beforeAll(async () => {
    expect(fse.existsSync(projectPath), `Project ${name} is not found`).toBe(true)
  })

  beforeEach(async () => {
    await resetProject()
  })

  for (const config of configs) {
    const test = config.only ? it.only : config.skip ? it.skip : it;
    test(`Run config ${config.name}`, async () => {
      await runBuild(config)
      await runSnapshot(config)
    }, {
      timeout: 30 * 1000
    })
  }
}

interface Folder {
  name: string,
  files: (File | Folder)[]
}

interface File {
  name: string
}

async function buildFolderStructure(dir: string): Promise<Folder> {
  const dirname = path.basename(dir)
  const files = await fse.readdir(dir)
  files.sort()

  return {
    name: dirname,
    files: await Promise.all(files.map(async (file) => {
      const filePath = path.join(dir, file)
      const stat = await fse.stat(filePath)
      if (stat.isFile()) {
        return { name: file }
      }
      return buildFolderStructure(filePath)
    }))
  }
}

async function snapshotFolderContent(rootDir: string, folder: Folder, parentPath: string = '') {
  const { name, files } = folder
  parentPath = path.join(parentPath, name)
  await Promise.all(files.map(async file => {
    const absPath = path.join(rootDir, parentPath, file.name)
    const relPath = path.join(parentPath, file.name)
    if ('files' in file) {
      await snapshotFolderContent(rootDir, file, parentPath)
    } else {
      const content = await fse.readFile(absPath, 'utf8')
      expect(content).toMatchSnapshot(`file content ${relPath}`)
    }
  }))
}

function buildIcePkgConfigScript(config: UserConfig) {
  return `
import { defineConfig } from '@ice/pkg'

export default defineConfig(${JSON.stringify(config, null, 2)})
  `.trim()
}
