const { readFileSync, writeFileSync } = require('fs');
const readMeFilePath = 'README.md';
const readMeFile = readFileSync(readMeFilePath, { encoding: 'utf-8' });
const disclaimerContent = readFileSync('src/frontend/assets/embedded/DISCLAIMER.html', { encoding: 'utf-8' });
const QUOTE_TAG = '> ';
const readMeFileWithDisclaimer = readMeFile.replace(
  /(?<=<!-- START_OF disclaimer -->\n?).*?(?=\n?<!-- END_OF disclaimer -->)/,
  `${QUOTE_TAG}${disclaimerContent}`
);

writeFileSync(readMeFilePath, readMeFileWithDisclaimer);
