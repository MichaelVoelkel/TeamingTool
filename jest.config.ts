import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testMatch: ["**/src/**/*.test.ts"],
  testPathIgnorePatterns: [
      '/node_modules',
      '.git'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: [
      'node_modules',
      'src'
    ]
};

export default config;