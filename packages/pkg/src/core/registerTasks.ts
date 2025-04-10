import {
  AliasBundleFormatString,
  Context,
  CustomFormatTaskCreator,
  BundleFormat,
  TransformFormat,
  TaskName,
} from '../types.js';
import { createFormat, isAliasFormatString, toFormat, tryToFormat } from '../helpers/formats.js';
import { ALIAS_BUNDLE_FORMATS_MAP, ALIAS_TRANSFORM_FORMATS_MAP } from '../constants.js';
import { groupBy } from 'es-toolkit/array';

export function registerTasks(ctx: Context, customFormats: Record<string, CustomFormatTaskCreator>) {
  const {
    userConfig,
    registerTask,
  } = ctx;
  const transformUserFormats = userConfig.transform.formats;
  for (const format of transformUserFormats) {
    if (isAliasFormatString(format, ALIAS_TRANSFORM_FORMATS_MAP)) {
      registerTask(`transform-${format}`, {
        type: 'transform',
        format: toFormat<TransformFormat>(ALIAS_TRANSFORM_FORMATS_MAP[format]),
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

      if (aliasedFormatsGroup.es2017?.length) {
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

  if ((userConfig.declaration ?? true) && (transformUserFormats.length)) {
    registerTask(TaskName.DECLARATION, {
      type: 'declaration',
      transformFormats: transformUserFormats,
    });
  }
}
