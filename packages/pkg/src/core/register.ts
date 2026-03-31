import {
  AliasBundleFormatString,
  Context,
  BundleFormat,
  TransformFormat,
  TaskConfig,
  TaskName,
  PkgResolvedConfig,
  NodeModuleType,
} from '../types.js';
import { createFormat, isAliasFormatString, toFormat, tryToFormat } from '../helpers/formats.js';
import { ALIAS_BUNDLE_FORMATS_MAP, ALIAS_TRANSFORM_FORMATS_MAP } from '../constants.js';
import { groupBy } from 'es-toolkit/array';
import { getPkgTaskName } from './pkg.js';

function createRegisterBuiltinTask(registerTask: Context['registerTask']) {
  return (name: string, config: TaskConfig) => {
    registerTask(name, {
      ...config,
      order: 'builtin',
    });
  };
}

export function registerTasks(ctx: Context) {
  const { userConfig, registerTask } = ctx;
  const registerBuiltinTask = createRegisterBuiltinTask(registerTask);
  const transformUserFormats = userConfig.transform?.formats;
  let hasTransformTasks = false;
  if (Array.isArray(transformUserFormats)) {
    for (const format of transformUserFormats) {
      hasTransformTasks = true;
      if (isAliasFormatString(format, ALIAS_TRANSFORM_FORMATS_MAP)) {
        const fmt = toFormat<TransformFormat>(ALIAS_TRANSFORM_FORMATS_MAP[format]);
        registerBuiltinTask(`transform-${format}`, {
          type: 'transform',
          format: fmt,
        });
      } else {
        const structFormat = tryToFormat<TransformFormat>(format);
        if (!structFormat) {
          throw new Error(`Unknown transform format "${format}"`);
        }
        registerBuiltinTask(`transform-${format}`, {
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
      // standard or unknow format string
      return 'others';
    });

    if (groupedFormats.alias?.length) {
      const formats = groupedFormats.alias as AliasBundleFormatString[];
      const aliasedFormatsGroup = groupBy(formats, (format) =>
        format === 'mf' ? 'mf' : format === 'es2017' ? 'es2017' : 'es5',
      );
      const es5Formats = aliasedFormatsGroup.es5 as Array<Exclude<AliasBundleFormatString, 'es2017'>> | undefined;

      if (es5Formats?.length) {
        const structs: BundleFormat[] = es5Formats.map((module) => createFormat(module, 'es5'));
        registerBuiltinTask(TaskName.BUNDLE_ES5, {
          type: 'bundle',
          formats: structs,
        });
      }

      if (aliasedFormatsGroup.es2017?.length && es5Formats) {
        registerBuiltinTask(TaskName.BUNDLE_ES2017, {
          type: 'bundle',
          formats: es5Formats.map((module) => createFormat(module, 'es2017')),
        });
      }

      if (aliasedFormatsGroup.mf?.length) {
        registerBuiltinTask(`bundle-mf`, {
          type: 'bundle',
          formats: [createFormat('mf', 'es5')],
          engine: 'rslib',
        });
      }
    }

    for (const format of groupedFormats.others ?? []) {
      const structFormat = tryToFormat<BundleFormat>(format)!;
      if (!structFormat) {
        throw new Error(`Unknown bundle format "${format}"`);
      }
      registerBuiltinTask(`bundle-${format}`, {
        type: 'bundle',
        formats: [structFormat],
      });
    }
  }

  if ((userConfig.declaration ?? true) && hasTransformTasks) {
    registerBuiltinTask(TaskName.DECLARATION, {
      type: 'declaration',
    });
  }
}

export function registerPkgTasks(ctx: Context, pkgs: PkgResolvedConfig[]) {
  const { userConfig, registerTask } = ctx;
  const registerBuiltinTask = createRegisterBuiltinTask(registerTask);
  let hasTransformTasks = false;
  for (const pkg of pkgs) {
    const taskName = getPkgTaskName(pkg);
    if (pkg.bundle) {
      registerBuiltinTask(taskName, {
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
      registerBuiltinTask(taskName, {
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
    registerBuiltinTask(TaskName.DECLARATION, {
      type: 'declaration',
    });
  }
}
