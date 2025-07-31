module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js', '**/__tests__/**/*.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/config/**', '!src/models/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
