import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
  setupFilesAfterEnv: ['<rootDir>/enzyme-setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/rax-*'],
});
