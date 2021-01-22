const { spawnSync } = require('child_process');
const { normalize } = require('path');

const PRETTIER_FORMAT_CLI = Object.freeze({
  command: 'node',
  args: [normalize('node_modules/prettier/bin-prettier.js'), '--write', 'test/', '__mocks__/', '**/__mocks__/*', '--check'],
});
const NEW_LINE = '\n';

module.exports = class JestWatchPlugin {
  constructor() {
    this.formattedTestFiles = new Set();
  }

  apply(jestHooks) {
    jestHooks.onFileChange(({ projects }) => {
      const { testPaths } = projects[0];
      const prettierFormatResults = getPrettierFormatResults();
      const formattedUnitTestFiles = prettierFormatResults.filter((result) =>
        testPaths.find((path) => path.includes(result))
      );

      formattedUnitTestFiles.forEach((file) => {
        this.formattedTestFiles.add(file);
      });
    });

    jestHooks.onTestRunComplete(() => {
      console.log(
        `${NEW_LINE}Formatted test files:${getPrettierFormattingResultOutput([...this.formattedTestFiles])}${NEW_LINE}`
      );

      this.formattedTestFiles.clear();
    });
  }
};

function getPrettierFormatResults() {
  return spawnSync(PRETTIER_FORMAT_CLI.command, PRETTIER_FORMAT_CLI.args).output.toString().trim().split(NEW_LINE);
}

function getPrettierFormattingResultOutput(formattedTestFiles) {
  const LIST_BULLET_SYMBOL = '- ';
  const listItemsString = formattedTestFiles.join(`${NEW_LINE}${LIST_BULLET_SYMBOL}`);

  return formattedTestFiles.length ? `${NEW_LINE}${LIST_BULLET_SYMBOL}${listItemsString}` : ' none...';
}
