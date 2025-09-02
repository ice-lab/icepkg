import { defineConfig } from '@ice/pkg'
import pkgScope from './pkg-scope'

export default defineConfig({
  pkgs: [{
    target: 'es5',
    module: 'esm',
    plugins: [pkgScope],
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
  plugins: []
})
