const { execSync, spawnSync } = require('child_process');
const { normalize } = require('path');
const NORMALIZED_PRETTIER_BIN_PATH = normalize('node_modules/prettier/bin-prettier.js');

var testCommand = 'node node_modules/prettier/bin-prettier.js --write E:/Projects/Fake-PEV-Shopping/test/database/utils/queryBuilder.spec.js --check';

module.exports = class JestWatchPlugin {
  apply(jestHooks) {
    jestHooks.onFileChange(({ projects }) => {
      console.log('--- jest FILE CHANGED');

      // executeAndWait(() => {
      setTimeout(() => {
        console.log('--- jest CALLBACK');

        // var spawnRes = spawnSync(testCommand.split(' ')[0], testCommand.split(' ').slice(1), { stdio: 'inherit' });
        // console.log('---==== spawnRes:', spawnRes);

        const result = execSync(testCommand, { stdio: 'inherit' });

        // const { testPaths } = projects[0];
        // console.log('--- watch plugin /testPaths:', testPaths);
        //
        // const filePaths = testPaths.reduce((allPaths, path) => allPaths.concat(' ', path), '');
        // console.log('--- filePaths:',filePaths);
        //
        // execSync(`node ${NORMALIZED_PRETTIER_BIN_PATH} --write ${filePaths}`);

        console.log('--- jest CALLBACK END ---\n', (result || '').toString());
      }, 0);
    })
  }
}

function executeAndWait(callback, waitInMs) {
  (async () => {
    callback();
    await new Promise((resolve) => setTimeout(resolve, waitInMs));
  })();
}
