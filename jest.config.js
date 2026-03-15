module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./tests/setEnv.js'],
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
};
