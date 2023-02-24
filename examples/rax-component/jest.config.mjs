import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
  setupFilesAfterEnv: ['<rootDir>/enzyme-setup.ts'],
});
