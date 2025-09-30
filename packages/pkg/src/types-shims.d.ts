// Temporary shims for missing/partial type declarations
declare module 'rollup/dist/shared/watch.js' {
  import { EventEmitter } from 'events';
  export class Watcher extends EventEmitter {
    constructor(configs: unknown[], emitter: unknown);
    tasks: any[];
  }
}

declare module 'postcss-plugin-rpx2vw' {
  const plugin: any;
  export default plugin;
}
