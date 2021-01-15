const { execSync, spawnSync, spawn } = require('child_process');
const { normalize } = require('path');
const NEW_LINE = '\n';

const createPrettierCommand = (() => {
  const PRETTIER_BIN_PATH = normalize('node_modules/prettier/bin-prettier.js');

  return (paths = []) => ({
    command: 'node',
    args: [PRETTIER_BIN_PATH, '--write', paths.join(' '), '--check'],
  });
})();
// E:/Projects/Fake-PEV-Shopping/test/database/utils/queryBuilder.spec.js

module.exports = class JestWatchPlugin {
  constructor() {
    this.formattedTestFiles = new Set();
  }

  apply(jestHooks) {
    jestHooks.onFileChange(({ projects }) => {
      const { testPaths } = projects[0];
      const prettierFormatResults = getPrettierFormatResults(createPrettierCommand(testPaths));
      const formattedUnitTestFile = prettierFormatResults.find(result => testPaths.some(path => path.includes(result)));

      if (formattedUnitTestFile) {
        this.formattedTestFiles.add(formattedUnitTestFile);
      }
    });

    jestHooks.onTestRunComplete(() => {
      const LIST_BULLET_SYMBOL = '- ';
      const listItemsString = [...this.formattedTestFiles].join(`${NEW_LINE}${LIST_BULLET_SYMBOL}`);

      console.log(`${NEW_LINE}Formatted test files:${NEW_LINE}${LIST_BULLET_SYMBOL}${listItemsString}${NEW_LINE}`);
    });
  }
}

function getPrettierFormatResults(prettierCommand) {
  return spawnSync(prettierCommand.command, prettierCommand.args)
    .output
    .toString()
    .trim()
    .split(NEW_LINE);
}

function executeAndWait(callback, waitInMs) {
  (async () => {
    callback();
    await new Promise((resolve) => setTimeout(resolve, waitInMs));
  })();
}
