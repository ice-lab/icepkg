import { CommandArgs, Context as BuildScriptContext } from 'build-scripts';
import type { ICommandFn } from 'build-scripts/lib/Service.js';
import { Context, CustomFormatTaskCreator, ExtendsPluginAPI, TaskConfig, UserConfig } from '../types.js';
import taskRegisterPlugin from '../plugins/component.js';
import { userConfigSchema } from '../config/schema.js';
import { createMessageBuilder, fromZodError } from 'zod-validation-error';
import { registerTasks } from './registerTasks.js';
import { initContextTasks } from './initContextTasks.js';

export interface CreatePkgOptions {
  rootDir: string;
  command: string;
  commandArgs: CommandArgs;
  userConfig?: UserConfig;
  userConfigFile?: string;
}

export interface PkgCore {
  ctx: Context;
  run: () => Promise<void>;
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
export async function createPkg(options: CreatePkgOptions) {
  const customFormats: Record<string, CustomFormatTaskCreator> = {};

  const extendsPluginAPI: ExtendsPluginAPI = {
    registerFormat: (format, creator) => {
      if (!customFormats[format]) {
        customFormats[format] = creator;
      } else {
        throw new Error(`Cannot register format ${format} twice`);
      }
    },
  };
  const ctx = new BuildScriptContext<TaskConfig, ExtendsPluginAPI, UserConfig>({
    command: options.command,
    rootDir: options.rootDir,
    commandArgs: options.commandArgs,
    configFile: options.userConfigFile,
    plugins: [taskRegisterPlugin],
    extendsPluginAPI,
  });

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
    async run() {
      await commandHandler(ctx);
    },
  };

  let commandHandler: ICommandFn<TaskConfig, {}, UserConfig>;
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

  registerTasks(ctx, customFormats);

  initContextTasks(ctx);

  await ctx['runCliOption']();

  await ctx['runOnGetConfigFn']();

  return core;
}

