import * as path from 'path';
import fse from 'fs-extra';
import getTaskConfig from './getTaskConfig.js';
import { merge } from 'es-toolkit/object';
import type { Config as JestConfig } from 'jest';
import type { Service } from 'build-scripts';
import type { TaskConfig, UserConfig } from '../types';

export default function defineJestConfig(
  service: Service<TaskConfig, {}, UserConfig>,
  userJestConfig: JestConfig | (() => Promise<JestConfig>),
): () => Promise<JestConfig> {
  return async () => {
    // Support jest configuration (object or function) Ref: https://jestjs.io/docs/configuration
    let customJestConfig: JestConfig;
    if (typeof userJestConfig === 'function') {
      customJestConfig = await userJestConfig();
    } else {
      customJestConfig = userJestConfig;
    }

    const defaultConfig = await getDefaultConfig(service);

    return merge(defaultConfig, customJestConfig);
  };
}

async function getDefaultConfig(service: Service<TaskConfig, {}, UserConfig>): Promise<JestConfig> {
  const { taskConfig, context: { rootDir } } = await getTaskConfig(service);
  const { alias = {}, define = {} } = taskConfig;

  const moduleNameMapper = generateModuleNameMapper(rootDir, alias);

  return {
    moduleNameMapper,
    globals: define,
  };
}

function generateModuleNameMapper(rootDir: string, alias: TaskConfig['alias']) {
  const moduleNameMapper = {};
  for (const key in alias) {
    const aliasPath = alias[key];
    const absoluteAliasPath = path.isAbsolute(aliasPath) ? aliasPath : path.join(rootDir, aliasPath);
    const isDir = fse.lstatSync(absoluteAliasPath).isDirectory();
    moduleNameMapper[`^${key}${isDir ? '/(.*)' : ''}`] = `${absoluteAliasPath}${isDir ? '/$1' : ''}`;
  }

  return moduleNameMapper;
}
