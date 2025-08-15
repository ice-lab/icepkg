import { defineConfig } from '@ice/pkg'

export default defineConfig({
  entry: './src/entry-mts.ts',
  transform: {
    formats: ['cjs', 'esm']
  },
  bundle: {
    formats: ['cjs', 'esm'],
    externals: [/@swc\/helpers/]
  },
})
