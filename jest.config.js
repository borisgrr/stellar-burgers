const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@api$': path.resolve(__dirname, 'src/utils/burger-api.ts'),
    '^@utils-types$': path.resolve(__dirname, 'src/utils/types')
  }
};