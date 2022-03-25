import path from 'path';
import fs from 'fs-extra';
import { fork } from 'child_process';
import { createRequire } from 'module';
import consola from 'consola';

import type { PluginDocusaurusOptions } from './index.mjs';

const require = createRequire(import.meta.url);

export const doc = (api, options: PluginDocusaurusOptions) => {
  const { context } = api;
  const { rootDir, command } = context;

  const maybeCustomPath = path.join(rootDir, 'docusaurus.config.js');
  const docusaurusConfigFileExist = fs.pathExistsSync(maybeCustomPath);

  if (docusaurusConfigFileExist) {
    consola.warn('PLUGIN-DOCUSAURUS', 'Found docusaurus.config.js in current project. And you should configure docusaurus by yourself.');
  }

  const binPath = require.resolve('@docusaurus/core/bin/docusaurus.mjs');

  const child = fork(
    binPath,
    [
      command,
      !docusaurusConfigFileExist && `--config=${rootDir}/.docusaurus/docusaurus.config.cjs`,
      command === 'start' && `--port=${options.port}`,
    ].filter(Boolean),
    {
      cwd: rootDir,
      env: process.env,
    },
  );

  child.on('exit', (code) => {
    if (code === 1) {
      throw new Error('Doc build failed!');
    }
  });
};
