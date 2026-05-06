import { Context, TaskConfig, TaskName, PkgResolvedConfig, NodeModuleType } from '../types.js';
import { getPkgTaskName } from './pkg.js';

function createRegisterBuiltinTask(registerTask: Context['registerTask']) {
  return (name: string, config: TaskConfig) => {
    registerTask(name, {
      ...config,
      order: 'builtin',
    });
  };
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
