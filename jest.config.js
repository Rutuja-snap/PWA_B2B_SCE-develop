/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'http://localhost/' },
  roots: ['<rootDir>/projects/remote-b2b-sce/src/'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  clearMocks: true,
  testMatch: ['**/?(*.)+(spec).ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$'
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'mjs'],
  moduleNameMapper: {
    '^projects/remote-b2b-sce/src/environments/environment$': '<rootDir>/projects/remote-b2b-sce/src/environments/environment.ts',
    '^cache-lib$': '<rootDir>/__mocks__/cache-lib.js',
    '^cache-orchestrator$': '<rootDir>/__mocks__/cache-lib.js',
    '^lib-api$': '<rootDir>/__mocks__/lib-api.ts',
    '^api-integarted$': '<rootDir>/__mocks__/api-integarted.js',
    '^api-integrated$': '<rootDir>/__mocks__/api-integarted.js',
    '^parent-storage$': '<rootDir>/__mocks__/parent-storage.js'
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit',
        outputName: 'junit.xml'
      }
    ]
  ],
  collectCoverage: true,
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageThreshold: {
    global: { branches: 0, functions: 0, lines: 0, statements: 0 }
  },
  collectCoverageFrom: [
    'projects/remote-b2b-sce/src/**/*.ts',
    '!projects/remote-b2b-sce/src/**/*.spec.ts',
    '!projects/remote-b2b-sce/src/main.ts',
    '!projects/remote-b2b-sce/src/polyfills.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
