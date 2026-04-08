export default {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.module\\.(css|scss|less)$': 'identity-obj-proxy',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
};
