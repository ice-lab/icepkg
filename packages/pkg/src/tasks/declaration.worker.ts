import fs from 'fs-extra';
import path from 'node:path';
import { parentPort } from 'node:worker_threads';
import { dtsCompile } from '../helpers/dts.js';
import { Rpc } from '../helpers/rpc.js';
import { DeclarationMainMethods, DeclarationWorkerMethods } from './declaration.rpc.js';

const rpc = new Rpc<DeclarationMainMethods, DeclarationWorkerMethods>(parentPort, {
  run: async (outputDirs, options) => {
    const dtsFiles = await dtsCompile(options);

    await Promise.all(outputDirs.map(async (dir) => {
      await fs.ensureDir(dir);
      for (const file of dtsFiles) {
        if (!file.dtsContent) {
          continue;
        }
        const relDtsPath = path.relative(options.outputDir, file.dtsPath);
        const dtsPath = path.join(dir, relDtsPath);
        await fs.ensureDir(path.dirname(dtsPath));
        await fs.writeFile(dtsPath, file.dtsContent);
      }
    }));
  },
});
