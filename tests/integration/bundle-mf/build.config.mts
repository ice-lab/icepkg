import { defineConfig } from '@ice/pkg';
import { mf } from '@ice/pkg-plugin-mf';

export default defineConfig({
  pkgs: [{
    entry: './src/index.ts',
    module: 'mf',
    target: 'es2017',
    externals: {
      react: 'React@18.3.1',
      'react-dom': 'ReactDOM@18.3.1'
    },
    bundle: true,
    engine: 'rslib',
    plugins: [
      mf({
        name: 'test_remote',
        exposes: {
          '.': './src/index.ts',
          './Counter': './src/Counter.ts',
          './App': './src/App.tsx',
        },
        getPublicPath: 'return "http://localhost:4444/"',
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true }
        }
      })
    ]
  }],
  plugins: [

  ],
});