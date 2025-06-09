import { BundleTaskConfig, Context, NodeEnvMode, PackageJson } from '../../types.js';
import type { OutputOptions } from 'rollup';
import type { OutputOptions as RolldownOutputOptions } from 'rolldown';
import { getFilenameConfig } from './filename.js';
import minifyPlugin from '../../rollupPlugins/minify.js';
import { assertIsBundleFormatModule } from '../../helpers/formats.js';

interface GetOutputsOptions {
  engine: 'rollup' | 'rolldown';
  bundleTaskConfig: BundleTaskConfig;
  globals: Record<string, string>;
  pkg: PackageJson;
  mode: NodeEnvMode;
  command: Context['command'];
}

export function getOutputs({
  globals,
  bundleTaskConfig,
  pkg,
  mode,
  command,
  engine,
}: GetOutputsOptions): OutputOptions[] {
  const { outputDir, vendorName = 'vendor' } = bundleTaskConfig;

  const outputFormats = bundleTaskConfig.formats ?? [];

  const name = bundleTaskConfig.name ?? pkg.name;
  const minify = bundleTaskConfig.jsMinify!(mode, command);

  return outputFormats.map((format) => {
    // for rollup/rolldown, mf is not supported
    assertIsBundleFormatModule(format.module);
    const filenameConfig = getFilenameConfig(format, mode);
    const options: OutputOptions = {
      name,
      format: format.module,
      globals,
      sourcemap: bundleTaskConfig.sourcemap,
      exports: 'auto',
      dir: outputDir,
      assetFileNames: filenameConfig.asset,
      entryFileNames: filenameConfig.js,
      chunkFileNames: filenameConfig.js,
      manualChunks:
        format.module !== 'umd' && bundleTaskConfig.codeSplitting !== false
          ? (id, { getModuleInfo }) => {
              if (/node_modules/.test(id)) {
                return vendorName;
              }

              const entryPoints: string[] = [];

              const moduleInfo = getModuleInfo(id);
              if (!moduleInfo) return;
              const idsToHandle = new Set(moduleInfo.importers);

              for (const moduleId of idsToHandle) {
                const info = getModuleInfo(moduleId);
                if (!info) continue;
                const { isEntry, importers } = info;
                if (isEntry) {
                  entryPoints.push(moduleId);
                }

                for (const importerId of importers) {
                  idsToHandle.add(importerId);
                }
              }
              // For multiple entries, we put it into a "shared code" bundle
              if (entryPoints.length > 1) {
                return vendorName;
              }
            }
          : undefined,
    };

    if (engine === 'rollup') {
      if (minify) {
        options.plugins = [minifyPlugin(bundleTaskConfig.sourcemap, typeof minify === 'boolean' ? {} : minify.options)];
      }
      options.inlineDynamicImports = format.module === 'umd';
    } else if (engine === 'rolldown') {
      const rolldownOuptut = options as RolldownOutputOptions;
      if (minify) {
        rolldownOuptut.minify = typeof minify === 'boolean' ? minify : minify.options;
      }
      // rolldown can auto handle umd format to disable codeSplitting
      // if (format.module === 'umd') {
      //   rolldownOuptut.codeSplitting = false
      // }
    }

    return options;
  });
}
