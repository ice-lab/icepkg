import path from 'node:path';
import { CommandArgs, Context as BuildScriptContext, PluginList } from 'build-scripts';
import type { ICommandFn } from 'build-scripts/lib/Service.js';
import { globby } from 'globby';
import { Context, ExtendsPluginAPI, TaskConfig, UserConfig } from '../types.js';
import taskRegisterPlugin from '../plugins/component.js';
import { userConfigSchema } from '../config/schema.js';
import { createMessageBuilder, fromZodError } from 'zod-validation-error';
import { registerPkgTasks } from './register.js';
import { initContextTasks } from './init.js';
import { resolvePackage, runPkgPlugins } from './pkg.js';

export interface CreatePkgOptions {
  rootDir: string;
  command: string;
  commandArgs: CommandArgs;
  userConfig?: UserConfig;
  userConfigFile?: string;
}

export interface PkgCore {
  ctx: Context;
  run: () => unknown;
  resolvedConfigFile: string | null;
}

const BUILD_CONFIG_GLOB = 'build.config.{js,ts,mjs,mts,cjs,cts}';

async function resolveConfigFile(options: CreatePkgOptions): Promise<string | null> {
  const toAbsolutePath = (filePath: string) =>
    path.isAbsolute(filePath) ? filePath : path.resolve(options.rootDir, filePath);

  if (options.userConfigFile) {
    return toAbsolutePath(options.userConfigFile);
  }

  if (typeof options.commandArgs.config === 'string') {
    return toAbsolutePath(options.commandArgs.config);
  }

  const configFiles = await globby(BUILD_CONFIG_GLOB, {
    cwd: options.rootDir,
    onlyFiles: true,
    absolute: true,
  });

  return configFiles[0] ?? null;
}

/**
 * The whole process of pkg creation.
 *
 * 1. read user config
 * 2. resolve plugin
 * 3. run plugin
 *    1. register config validation(internal)
 *    2. register others(format, onGetConfig, etc...) or modifyUserConfig
 * 4. resolve and merge user config to finalize version
 * 5. validate user config
 * 6. register task based on user config
 * 7. init task config based on user config
 * 8. run task modify callback(Rollup,Styles,Swc,etc.)
 * 9. return pkg core object
 *
 * 为了实现以上流程，需要魔改 build-scripts 的部分逻辑，所以会尝试调用其 private 方法
 */
export async function createCore(options: CreatePkgOptions) {
  const resolvedConfigFile = await resolveConfigFile(options);

  const extendsPluginAPI: ExtendsPluginAPI = {
    pluginScope: 'global',
  };
  const ctx = new BuildScriptContext<TaskConfig, ExtendsPluginAPI, UserConfig>({
    command: options.command,
    rootDir: options.rootDir,
    commandArgs: options.commandArgs,
    configFile: resolvedConfigFile ?? undefined,
    plugins: [taskRegisterPlugin] as PluginList,
    extendsPluginAPI,
  }) as Context;

  if (options.userConfig) {
    ctx.userConfig = {
      plugins: [] as any[],
      ...options.userConfig,
    };
  } else {
    await ctx.resolveUserConfig();
  }

  const core: PkgCore = {
    ctx,
    resolvedConfigFile,
    run() {
      return commandHandler(ctx);
    },
  };

  let commandHandler: ICommandFn<TaskConfig, ExtendsPluginAPI, UserConfig>;
  switch (options.command) {
    case 'start':
      commandHandler = (await import('../commands/start.js')).default;
      break;
    case 'build':
      commandHandler = (await import('../commands/build.js')).default;
      break;
    case 'test':
      commandHandler = (await import('../commands/test.js')).default;
      break;
    default:
      throw new Error(`command ${options.command} not found`);
  }

  await ctx.resolvePlugins();
  await ctx['runPlugins']();
  // TODO: record which plugin modified userConfig for debug
  await ctx['runConfigModification']();

  const validateResult = userConfigSchema.safeParse(ctx.userConfig);
  if (!validateResult.success) {
    const messageBuilder = createMessageBuilder({
      prefix: '@ice/pkg config error',
    });
    const prettyError = fromZodError(validateResult.error, {
      messageBuilder,
    });
    throw prettyError;
  }

  const pkgs = await resolvePackage(ctx);

  if (pkgs.length === 0) {
    throw new Error(
      'No packages were resolved. Please check your `pkgs` configuration or whether all packages have been disabled.',
    );
  }

  await runPkgPlugins(ctx, pkgs);
  registerPkgTasks(ctx, pkgs);

  initContextTasks(ctx);

  await ctx['runCliOption']();

  await ctx['runOnGetConfigFn']();

  return core;
}
