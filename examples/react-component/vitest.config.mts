import pkgService, { defineVitestConfig } from '@ice/pkg';

export default defineVitestConfig(pkgService, () => ({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    globals: true,
  },
}));
