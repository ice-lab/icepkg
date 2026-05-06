import {
  AliasBundleFormatString,
  Context,
  PresetPkg,
  PkgResolvedConfig,
  PkgUserConfig,
  PluginInfo,
  UserConfig,
} from '../types.js';
import { ApplyMethodAPI, Context as BuildScriptContext, OnGetConfig } from 'build-scripts';
import { merge, pick, omit } from 'es-toolkit/object';
import { groupBy } from 'es-toolkit/array';
import { isAliasFormatString, tryToFormat } from '../helpers/formats.js';
import { ALIAS_BUNDLE_FORMATS_MAP } from '../constants.js';

const PLUGIN_CONTEXT_KEY = [
  'command' as const,
  'commandArgs' as const,
  'rootDir' as const,
  'userConfig' as const,
  'originalUserConfig' as const,
  'pkg' as const,
  'extendsPluginAPI' as const,
  'configFile' as const,
];

// 由于 build-scripts 并没有导出这个方法，所以只能先这样 mock 一下了
async function resolvePlugins(ctx: Context, plugins: UserConfig['plugins']): Promise<PluginInfo[]> {
  const mockContext = new BuildScriptContext({
    rootDir: ctx.rootDir,
    command: ctx.command,
    extendsPluginAPI: ctx.extendsPluginAPI,
    commandArgs: ctx.commandArgs,
  });
  mockContext.userConfig = {
    plugins: plugins as BuildScriptContext['userConfig']['plugins'],
  };
  return (await mockContext.resolvePlugins()) as PluginInfo[];
}

function isBundlePresetPkgString(pkg: string): boolean {
  return pkg[0] === '!';
}

const LEGACY_PRESET_CONFIG_MAP: Record<
  string,
  Pick<PkgResolvedConfig, 'id' | 'module' | 'target' | 'bundle' | 'outputDir' | 'displayId'>
> = {
  esm: {
    id: 'esm',
    module: 'esm',
    target: 'es5',
    outputDir: 'esm',
  },
  es2017: {
    id: 'es2017',
    module: 'esm',
    target: 'es2017',
    outputDir: 'es2017',
  },
  cjs: {
    id: 'cjs',
    module: 'cjs',
    target: 'es5',
    outputDir: 'cjs',
  },
  '!esm': {
    id: '!esm',
    module: 'esm',
    target: 'es5',
    displayId: 'esm',
    bundle: true,
  },
  '!es2017': {
    id: '!esm',
    module: 'esm',
    target: 'es2017',
    displayId: 'es2017',
    bundle: true,
  },
  '!cjs': {
    id: '!cjs',
    module: 'cjs',
    target: 'es5',
    displayId: 'cjs',
    bundle: true,
  },
  '!umd': {
    id: '!umd',
    module: 'umd',
    target: 'es5',
    displayId: 'umd',
    bundle: true,
  },
  es2022: {
    id: 'es2022',
    module: 'esm',
    target: 'es2022',
    outputDir: 'es2022',
  },
  '!es2022': {
    id: '!es2022',
    module: 'esm',
    target: 'es2022',
    displayId: 'es2022',
    bundle: true,
  },
};

function parsePresetPkgString(
  preset?: string,
): Pick<PkgResolvedConfig, 'id' | 'module' | 'target' | 'bundle' | 'outputDir' | 'displayId'> | null {
  if (!preset) {
    return null;
  }
  const bundle = preset[0] === '!';
  const fmtString = bundle ? preset.slice(1) : preset;
  const fmt = tryToFormat(fmtString);
  if (!fmt) {
    // use legacy format
    if (LEGACY_PRESET_CONFIG_MAP[preset]) {
      return { ...LEGACY_PRESET_CONFIG_MAP[preset] };
    }
    return null;
  }
  return {
    id: `${fmt.module}-${fmt.target}`,
    module: fmt.module,
    target: fmt.target,
    bundle,
  };
}

function resolveExtends(extendsConfig: string[] = [], pkgsMap: Map<string, PkgResolvedConfig>): Partial<PkgUserConfig> {
  let mergedConfig: Partial<PkgUserConfig> = {};

  for (const extend of extendsConfig) {
    let extendConfig: Partial<PkgUserConfig> | null = null;

    // 尝试解析为预设字符串
    const presetConfig = parsePresetPkgString(extend);
    if (presetConfig) {
      extendConfig = presetConfig;
    } else if (pkgsMap.has(extend)) {
      // 尝试从已解析的包配置中查找
      const referencedPkg = pkgsMap.get(extend)!;
      extendConfig = omit(referencedPkg, ['id', 'pluginInfos']);
    } else {
      throw new Error(`Unable to resolve extends "${extend}": not found in presets or package configurations`);
    }

    // 按顺序合并配置
    mergedConfig = merge(mergedConfig, extendConfig);
  }

  return mergedConfig;
}

export async function resolvePackage(ctx: Context) {
  const { userConfig } = ctx;

  // Derive pkgs from transform.formats / bundle.formats if not explicitly set,
  // falling back to the default ['esm'] when nothing is configured at all.
  const transformPresets = (userConfig.transform?.formats ?? []) as string[];
  const bundlePresets = (userConfig.bundle?.formats ?? []).map((f) => `!${f}`);
  const legacyPresets = [...transformPresets, ...bundlePresets];

  // Only fall back to the default when all three config keys are absent.
  // Explicitly configured empty arrays (e.g. transform.formats: []) mean
  // "no legacy formats", not "nothing configured".
  const hasLegacyConfig = userConfig.transform?.formats !== undefined || userConfig.bundle?.formats !== undefined;
  const rawPkgs = userConfig.pkgs ?? (hasLegacyConfig || legacyPresets.length ? [] : ['esm']);
  // Merge legacy presets, deduplicating against existing string entries in pkgs
  const existingStrings = new Set<string>(rawPkgs.filter((p): p is PresetPkg => typeof p === 'string'));
  const pkgs = [...rawPkgs, ...(legacyPresets.filter((p) => !existingStrings.has(p)) as PresetPkg[])];
  const resolvedPkgs: PkgResolvedConfig[] = [];
  const pkgsMap = new Map<string, PkgResolvedConfig>();

  function toValidId(id: string): string {
    if (!pkgsMap.has(id)) return id;
    for (let i = 1; ; i++) {
      if (!pkgsMap.has(`${id}-${i}`)) {
        return `${id}-${i}`;
      }
    }
  }

  const groupedPkgs = groupBy(pkgs, (pkg) => {
    if (typeof pkg === 'string') {
      if (isBundlePresetPkgString(pkg)) {
        if (isAliasFormatString(pkg.slice(1), ALIAS_BUNDLE_FORMATS_MAP)) {
          // 旧版本的 Bundle 配置，例如 esm/es2017，它们之间关系比较特殊，属于正交的能力，所以需要单独处理
          return 'bundleLegacy';
        }
      }
      return 'preset';
    }
    if (typeof pkg !== 'object' || pkg.disable) {
      // invalid pkg or disabled pkg
      return 'ignore';
    }
    return 'pkg';
  }) as {
    bundleLegacy?: string[];
    preset?: string[];
    pkg?: PkgUserConfig[];
    ignore?: unknown[];
  };

  if (groupedPkgs.bundleLegacy?.length) {
    const formats = groupedPkgs.bundleLegacy.map((v) => v.slice(1)) as AliasBundleFormatString[];
    const aliasedFormatsGroup = groupBy(formats, (format) => (format === 'es2017' ? 'es2017' : 'es5'));
    const es5Formats = aliasedFormatsGroup.es5 as
      | Array<Exclude<AliasBundleFormatString, 'es2017' | 'es2022'>>
      | undefined;

    if (es5Formats?.length) {
      const resolvedPkg: PkgResolvedConfig = {
        id: toValidId('!es5'),
        module: 'esm', // will be ignored
        target: 'es5',
        displayId: 'es5',
        bundle: true,
        legacyModules: es5Formats,
        pluginInfos: [],
      };
      pkgsMap.set(resolvedPkg.id, resolvedPkg);
      resolvedPkgs.push(resolvedPkg);
    }

    if (aliasedFormatsGroup.es2017?.length) {
      const resolvedPkg: PkgResolvedConfig = {
        id: toValidId('!es2017'),
        module: 'esm', // will be ignored
        target: 'es2017',
        displayId: 'es2017',
        bundle: true,
        legacyModules: es5Formats,
        pluginInfos: [],
      };
      pkgsMap.set(resolvedPkg.id, resolvedPkg);
      resolvedPkgs.push(resolvedPkg);
    }
  }

  for (const pkg of groupedPkgs.preset ?? []) {
    const presetConfig = parsePresetPkgString(pkg);
    if (!presetConfig) {
      throw new Error(`Unknown preset package "${pkg}"`);
    }
    const id = toValidId(presetConfig.id);
    const resolvedPkg: PkgResolvedConfig = {
      ...presetConfig,
      id,
      pluginInfos: [],
    };
    pkgsMap.set(id, resolvedPkg);
    resolvedPkgs.push(resolvedPkg);
  }

  for (const pkg of groupedPkgs.pkg ?? []) {
    const { target = 'es2017', module = 'esm', extends: extendsConfig, id: userId, ...restPkgConfig } = pkg;
    // 处理 extends 配置
    const extendedConfig = resolveExtends(extendsConfig, pkgsMap);

    const resolvedPkg: PkgResolvedConfig = {
      target,
      module,
      ...extendedConfig,
      ...restPkgConfig,
      id: '', // modify later
      pluginInfos: await resolvePlugins(ctx, pkg.plugins ?? []),
    };

    if (userId) {
      resolvedPkg.id = toValidId(userId);
    } else {
      let id: string = resolvedPkg.module;
      if (pkgsMap.has(id)) {
        id = `${resolvedPkg.module}-${resolvedPkg.target}`;
        if (pkgsMap.has(id)) {
          id = toValidId(id);
        }
      }
      resolvedPkg.id = id;
    }

    if (pkg.module === 'mf' && pkg.engine !== 'rslib') {
      console.warn(`mf must use rslib engine, so it will be automatically set to rslib`);
      pkg.engine = 'rslib';
    }

    pkgsMap.set(resolvedPkg.id, resolvedPkg);
    resolvedPkgs.push(resolvedPkg);
  }

  return resolvedPkgs;
}

export async function runPkgPlugins(ctx: Context, pkgs: PkgResolvedConfig[]) {
  for (const pkg of pkgs) {
    for (const pluginInfo of pkg.pluginInfos) {
      const { setup, options, name: pluginName } = pluginInfo;
      const taskName = getPkgTaskName(pkg);

      const pluginContext = pick(ctx, PLUGIN_CONTEXT_KEY);
      const applyMethod: ApplyMethodAPI = (methodName, ...args) => {
        return ctx['applyMethod']([methodName, pluginName], ...args);
      };
      const ignoreGlobalApi = <T extends (...args: any[]) => any>(methodName: string, fn: T): T => {
        return ((...args: Parameters<T>): ReturnType<T> => {
          ctx.logger.warn(
            `Pkg plugin "${pluginName}" is not allowed to use global plugin API "${methodName}". Please don't use it.`,
          );
          return null as ReturnType<T>;
        }) as T;
      };
      const onGetConfig = ((nameOrFn: string | ((config: unknown) => unknown), fn?: (config: unknown) => unknown) => {
        if (typeof nameOrFn === 'string') {
          if (nameOrFn !== taskName) {
            ctx.logger.warn(
              `Pkg plugin "${pluginName}" is not allowed to use onGetConfig with task name "${nameOrFn}". Only allow "${taskName}" or omitted`,
            );
            return;
          }
        } else {
          fn = nameOrFn;
          nameOrFn = taskName;
        }

        return ctx['onGetConfig'](nameOrFn, fn);
      }) as OnGetConfig<unknown>;

      const pluginAPI = merge(
        {
          context: pluginContext,
          registerTask: ignoreGlobalApi('registerTask', ctx['registerTask']),
          getAllTask: ctx['getAllTask'],
          getAllPlugin: ctx['getAllPlugin'],
          cancelTask: ignoreGlobalApi('cancelTask', ctx['cancelTask']),
          onGetConfig: onGetConfig,
          onGetJestConfig: ctx['onGetJestConfig'],
          onHook: ctx['onHook'],
          setValue: ctx['setValue'],
          getValue: ctx['getValue'],
          registerUserConfig: ignoreGlobalApi('registerUserConfig', ctx['registerUserConfig']),
          hasRegistration: ignoreGlobalApi('hasRegistration', ctx['hasRegistration']),
          registerCliOption: ignoreGlobalApi('registerCliOption', ctx['registerCliOption']),
          registerMethod: ctx['registerMethod'],
          applyMethod,
          hasMethod: ctx['hasMethod'],
          modifyUserConfig: ignoreGlobalApi('modifyUserConfig', ctx['modifyUserConfig']),
          modifyConfigRegistration: ignoreGlobalApi('modifyConfigRegistration', ctx['modifyConfigRegistration']),
          modifyCliRegistration: ignoreGlobalApi('modifyCliRegistration', ctx['modifyCliRegistration']),
        },
        {
          ...(ctx['extendsPluginAPI'] || {}),
          pluginScope: 'pkg',
        },
      );

      if (typeof setup === 'function') {
        await setup(pluginAPI as any, options);
      }
    }
  }
}

export function getPkgTaskName(pkg: PkgResolvedConfig) {
  return `${pkg.bundle ? 'bundle' : 'transform'}-${pkg.displayId ?? pkg.id}`;
}
