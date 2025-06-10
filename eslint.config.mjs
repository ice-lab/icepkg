import eslint from '@ice/spec/eslint';

export default [
  ...eslint.getConfig({
    preset: 'pkg',
  }),
  {
    files: [
      'examples/**/*.{js,jsx,ts,tsx}',
      'tests/**/*.{js,jsx,ts,tsx}',
      'scripts/**/*.{ts,js}',
    ],
    rules: {
      // 测试文件允许使用 console
      'no-console': 'off',
    },
  },
  {
    ignores: ['**/{esm,es2017,cjs,lib}/'],
  },
];
