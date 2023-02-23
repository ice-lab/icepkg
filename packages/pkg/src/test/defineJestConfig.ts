import merge from 'lodash.merge';
import * as path from 'path';
import fse from 'fs-extra';
import getTaskConfig from './getTaskConfig.js';

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

async function getDefaultConfig(service: Service<TaskConfig, {}, UserConfig>) {
  const taskConfig = await getTaskConfig(service);
  const { alias = {} } = taskConfig;

  const moduleNameMapper = generateModuleNameMapper(alias);

  return {
    moduleNameMapper,
  };
}

function generateModuleNameMapper(alias: TaskConfig['alias']) {
  const moduleNameMapper = {};
  for (const key in alias) {
    const aliasPath = alias[key];
    const isDir = path.isAbsolute(aliasPath) && fse.lstatSync(aliasPath).isDirectory();
    moduleNameMapper[`^${key}${isDir ? '/(.*)' : ''}`] = `${aliasPath}${isDir ? '/$1' : ''}`;
  }

  return moduleNameMapper;
}
