import {
  AliasBundleFormatString,
  Context,
  CustomFormatTaskCreator,
  BundleFormat,
  TransformFormat,
  TaskName,
  PkgResolvedConfig,
  NodeModuleType,
} from '../types.js';
import { createFormat, isAliasFormatString, toFormat, tryToFormat } from '../helpers/formats.js';
import { ALIAS_BUNDLE_FORMATS_MAP, ALIAS_TRANSFORM_FORMATS_MAP } from '../constants.js';
import { groupBy } from 'es-toolkit/array';
import { getPkgTaskName } from './pkg.js';

export function registerTasks(ctx: Context, customFormats: Record<string, CustomFormatTaskCreator>) {
  const { userConfig, registerTask } = ctx;
  const transformUserFormats = userConfig.transform?.formats;
  let hasTransformTasks = false;
  if (Array.isArray(transformUserFormats)) {
    for (const format of transformUserFormats) {
      hasTransformTasks = true;
      if (isAliasFormatString(format, ALIAS_TRANSFORM_FORMATS_MAP)) {
        const fmt = toFormat<TransformFormat>(ALIAS_TRANSFORM_FORMATS_MAP[format]);
        registerTask(`transform-${format}`, {
          type: 'transform',
          format: fmt,
        });
      } else if (customFormats[format]) {
        const task = customFormats[format]({
          format,
          type: 'transform',
        });
        if (task) {
          registerTask(`transform-${format}`, task);
        }
      } else {
        const structFormat = tryToFormat<TransformFormat>(format);
        if (!structFormat) {
          throw new Error(`Unknown transform format "${format}"`);
        }
        registerTask(`transform-${format}`, {
          type: 'transform',
          format: structFormat,
        });
      }
    }
  }

  if (userConfig.bundle) {
    const groupedFormats = groupBy(userConfig.bundle?.formats ?? ['esm', 'es2017'], (format) => {
      if (isAliasFormatString(format, ALIAS_BUNDLE_FORMATS_MAP)) {
        return 'alias';
      }
      if (customFormats[format]) {
        return 'custom';
      }
      // standard or unknow format string
      return 'others';
    });

    if (groupedFormats.alias?.length) {
      const formats = groupedFormats.alias as AliasBundleFormatString[];
      const aliasedFormatsGroup = groupBy(formats, (format) => (format === 'es2017' ? 'es2017' : 'es5'));
      const es5Formats = aliasedFormatsGroup.es5 as Array<Exclude<AliasBundleFormatString, 'es2017'>> | undefined;

      if (es5Formats?.length) {
        const structs: BundleFormat[] = es5Formats.map((module) => createFormat(module, 'es5'));
        registerTask(TaskName.BUNDLE_ES5, {
          type: 'bundle',
          formats: structs,
        });
      }

      if (aliasedFormatsGroup.es2017?.length && es5Formats) {
        registerTask(TaskName.BUNDLE_ES2017, {
          type: 'bundle',
          formats: es5Formats.map((module) => createFormat(module, 'es2017')),
        });
      }
    }

    for (const format of groupedFormats.custom ?? []) {
      const task = customFormats[format]({
        format,
        type: 'bundle',
      });
      if (task) {
        registerTask(`bundle-${format}`, task);
      }
    }

    for (const format of groupedFormats.others ?? []) {
      const structFormat = tryToFormat<BundleFormat>(format)!;
      if (!structFormat) {
        throw new Error(`Unknown bundle format "${format}"`);
      }
      registerTask(`bundle-${format}`, {
        type: 'bundle',
        formats: [structFormat],
      });
    }
  }

  if ((userConfig.declaration ?? true) && hasTransformTasks) {
    registerTask(TaskName.DECLARATION, {
      type: 'declaration',
    });
  }
}

export function registerPkgTasks(ctx: Context, pkgs: PkgResolvedConfig[]) {
  const { userConfig, registerTask } = ctx;
  let hasTransformTasks = false;
  for (const pkg of pkgs) {
    const taskName = getPkgTaskName(pkg);
    if (pkg.bundle) {
      registerTask(taskName, {
        type: 'bundle',
        formats: pkg.legacyModules
          ? pkg.legacyModules.map((module) => ({
              module,
              target: pkg.target,
            }))
          : [
              {
                module: pkg.module,
                target: pkg.target,
              },
            ],
        pkg,
      });
    } else {
      hasTransformTasks = true;
      registerTask(taskName, {
        type: 'transform',
        format: {
          module: pkg.module as NodeModuleType,
          target: pkg.target,
        },
        pkg,
      });
    }
  }

  if ((userConfig.declaration ?? true) && hasTransformTasks) {
    registerTask(TaskName.DECLARATION, {
      type: 'declaration',
    });
  }
}
