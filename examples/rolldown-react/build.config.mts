import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config-list
export default defineConfig({
  pkgs: [
    'esm', 'es2017', 'cjs',
    // '!esm', '!es2017', '!umd',
    { extends: ['!esm'] },
    {extends: ['!es2017']},
    {extends: ['!umd']}
  ],
  plugins: [
    ['@ice/pkg-plugin-jsx-plus'],
  ],
  jsxRuntime: 'classic',
  sourceMaps: false,
  bundle: {
    engine: 'rolldown'
  },
  declaration: {
    generator: 'oxc',
  },
  alias: {
    '@': './src',
  },
});
