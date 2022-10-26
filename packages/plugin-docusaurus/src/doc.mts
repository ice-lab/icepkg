import path from 'path';
import fs from 'fs-extra';
import { fork } from 'child_process';
import { createRequire } from 'module';
import consola from 'consola';
import detect from 'detect-port';
import { DOCUSAURUS_DIR, DOCUSAURUS_CONFIG_FILE, DOCUSAURUS_BABEL_CONFIG_FILE } from './constants.mjs';

import type { PluginDocusaurusOptions } from './index.mjs';

const require = createRequire(import.meta.url);

export const doc = async (api, options: PluginDocusaurusOptions) => {
  const { context } = api;
  const { rootDir, command } = context;

  const maybeCustomPath = path.join(rootDir, 'docusaurus.config.js');
  const docusaurusConfigFileExist = fs.pathExistsSync(maybeCustomPath);

  if (docusaurusConfigFileExist) {
    consola.warn('PLUGIN-DOCUSAURUS', 'Found docusaurus.config.js in current project. And you should configure docusaurus by yourself.');
  }

  const port = await detect(options.port);

  const binPath = require.resolve('@docusaurus/core/bin/docusaurus.mjs');

  const child = fork(
    binPath,
    [
      command,
      !docusaurusConfigFileExist && `--config=${rootDir}/${DOCUSAURUS_DIR}/${DOCUSAURUS_CONFIG_FILE}`,
      command === 'start' && `--port=${port}`,
      command === 'start' && '--host=0.0.0.0',
    ].filter(Boolean),
    {
      cwd: rootDir,
      env: {
        ...process.env,
        DOCUSAURUS_BABEL_CONFIG_FILE_NAME: `${DOCUSAURUS_DIR}/${DOCUSAURUS_BABEL_CONFIG_FILE}`,
      },
    },
  );

  child.on('exit', (code) => {
    if (code === 1) {
      throw new Error('Doc build failed!');
    }
  });

  // If transofrm task failed and main process exit,
  // then doc process should be killed too
  process.on('exit', () => {
    child.kill();
  });
};
