import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
});
