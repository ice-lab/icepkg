import { defineConfig } from '@ice/pkg'
import plugin from './plugins/plugin-scope'

export default defineConfig({
  pkgs: [{
    target: 'es5',
    module: 'esm',
    plugins: [plugin],
    outputDir: 'esm'
  }, {
    target: 'es2017',
    module: 'esm',
    outputDir: 'es2017',
    // no plugin
  }],
  define: {
    __PLUGIN_INFO__: {
      name: 'global'
    }
  },
  plugins: [plugin]
})
