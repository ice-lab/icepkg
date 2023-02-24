import pkgService, { defineJestConfig } from '@ice/pkg';

export default defineJestConfig(pkgService, {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.module\\.(css|scss|less)$': 'identity-obj-proxy',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
});
