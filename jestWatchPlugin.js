const { execSync, spawnSync, spawn } = require('child_process');
const { normalize } = require('path');
const NORMALIZED_PRETTIER_BIN_PATH = normalize('node_modules/prettier/bin-prettier.js');

var testCommand = 'node node_modules/prettier/bin-prettier.js --write E:/Projects/Fake-PEV-Shopping/test/database/utils/queryBuilder.spec.js --check';

module.exports = class JestWatchPlugin {
  constructor() {
    this.formattedTestFiles = [];
  }

  apply(jestHooks) {
    jestHooks.onFileChange(({ projects }) => {
      console.log('--- jest FILE CHANGED');

      // executeAndWait(() => {
      // setTimeout(() => {
        console.log('--- jest CALLBACK');

        // var spawnRes = spawn(testCommand.split(' ')[0], testCommand.split(' ').slice(1)/*, { stdio: 'inherit' }*/);
        var spawnRes = spawnSync(testCommand.split(' ')[0], testCommand.split(' ').slice(1)/*, { stdio: 'inherit' }*/);

        setTimeout(() => {
          console.log('---==== spawnRes:', spawnRes.output.toString());
        }, 2000);
        this.formattedTestFiles.push(spawnRes.output.toString().trim().split('\n'));

        // spawnRes.stdout.on('data', (data) => {
        //   setTimeout(() => {
        //     console.log(`>>> stdout: ${data.toString()}`);
        //   }, 2000);
        //     this.formattedTestFiles.push(data.toString().trim().split('\n'));
        // });

        // const result = execSync(testCommand, { stdio: 'inherit' });

        // const { testPaths } = projects[0];
        // console.log('--- watch plugin /testPaths:', testPaths);
        //
        // const filePaths = testPaths.reduce((allPaths, path) => allPaths.concat(' ', path), '');
        // console.log('--- filePaths:',filePaths);
        //
        // execSync(`node ${NORMALIZED_PRETTIER_BIN_PATH} --write ${filePaths}`);
    });

    jestHooks.onTestRunComplete(() => {
      setTimeout(() => {
        console.log('this.formattedTestFiles:', this.formattedTestFiles);
      }, 3000);
    });
  }
}

function executeAndWait(callback, waitInMs) {
  (async () => {
    callback();
    await new Promise((resolve) => setTimeout(resolve, waitInMs));
  })();
}
