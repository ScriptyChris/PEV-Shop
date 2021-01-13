// const prettierRunner = require('jest-runner-prettier');
// const eslintPreset = require('jest-runner-eslint');
debugger;
// console.log('prettierRunner:', prettierRunner);

module.exports = {
  runner: 'prettier',
  watchPlugins: ['./jestWatchPlugin'],
  // preset: 'jest-runner-prettier'
};


// CLI: node --inspect node_modules/jest/node_modules/jest-cli/bin/jest.js --watch
