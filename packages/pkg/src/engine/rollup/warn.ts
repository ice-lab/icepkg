import type { RollupLog, RollupOptions, WarningHandlerWithDefault } from 'rollup';

function isIgnorableWarning(warning: RollupLog) {
  return warning.code === 'EMPTY_BUNDLE' || warning.message.includes('Generated an empty chunk');
}

export function withFilteredRollupWarnings(rollupOptions: RollupOptions): RollupOptions {
  const onwarn = rollupOptions.onwarn;
  const filteredOnwarn: WarningHandlerWithDefault = (warning, defaultHandler) => {
    if (isIgnorableWarning(warning)) {
      return;
    }

    if (onwarn) {
      onwarn(warning, defaultHandler);
    } else {
      defaultHandler(warning);
    }
  };

  return {
    ...rollupOptions,
    onwarn: filteredOnwarn,
  };
}
