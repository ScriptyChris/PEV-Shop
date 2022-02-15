/*
  TODO: [DX: TS + Docker]

  Since Cypress is able of consuming TypeScript files via `ts-node`, it might be a better choice to expose 
  src/ and alike dependencies of E2E files with regarding `tsconfig.json` files instead of compiling them at author time.
  This will eliminate the need to put compiled `.js` files to the repo for CI/CD to run them during E2E tests.
*/

import { parse } from 'path';
import { mkdirSync, renameSync } from 'fs';

const ROOT_PATH = process.cwd();
console.log('[TS deps gen] ROOT_PATH?', ROOT_PATH, '\n/cwd:', process.cwd());

const inputData = (await getInputPath()).toString().trim();
const dataIsEmpty = inputData.trim() === '';
// console.log('[TS deps gen] inputData:',inputData)

if (inputData.includes('error') || dataIsEmpty) {
  const inputErrorMsg = dataIsEmpty ? 'input data is empty...' : `\n${inputData}`;

  // log assumed error
  console.error(
    '\n------------------------------',
    '\n------------------------------\n',
    'TypeScript compilation might encountered an error:',
    inputErrorMsg,
    '\n------------------------------',
    '\n------------------------------\n'
  );

  // exit process if the error comes from TypeScript or input is empty
  if (inputData.includes('error TS') || dataIsEmpty) {
    process.exit(1);
  }
}

const LINE_APPENDIX = 'TSFILE: ';
const EXCLUDED_PATH_FRAGMENTS = ['/test/', '/dist/'];
const TARGET_PATH_START = './test/e2e/cypress/fixtures/generatedDependencies';
const filteredPaths = inputData.split('\n').filter(excludePaths);
console.log('[TS deps gen] filteredPaths:', filteredPaths);

if (!filteredPaths.length) {
  console.error(
    '\n------------------------------\n',
    'No file dependencies found for E2E tests!',
    '\n------------------------------\n'
  );

  process.exit(1);
}

filteredPaths.forEach(generateDepsFileStructure);

console.log(
  '\n------------------------------\n',
  `Generated E2E tests dependencies file structure inside "${TARGET_PATH_START}" folder!`,
  '\n------------------------------\n'
);

async function getInputPath() {
  let inputPath = '';

  for await (const chunk of process.stdin) {
    inputPath += chunk;
  }

  return inputPath;
}

function excludePaths(line) {
  return !EXCLUDED_PATH_FRAGMENTS.some((fragment) => line.includes(fragment));
}

function generateDepsFileStructure(line) {
  line = line.replace(LINE_APPENDIX, '');

  const { dir: fullOldDirPath, base: fileName } = parse(line);
  const projectBasedOldDir = fullOldDirPath.slice(ROOT_PATH.length);
  // console.log('\n\nline:', line, '\nfullSrcDirPath:', fullOldDirPath, '\nprojectBasedSrcDir:', projectBasedOldDir);

  const newDirPath = `${TARGET_PATH_START}${projectBasedOldDir}`;
  // console.log('\n---newDirPath:', newDirPath);

  mkdirSync(newDirPath, { recursive: true });

  // console.log('\n===fileName:', fileName, '\nfrom:', line, '\nto:', `${newDirPath}/${fileName}`);

  renameSync(`${fullOldDirPath}/${fileName}`, `${newDirPath}/${fileName}`);
}
