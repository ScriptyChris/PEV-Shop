#!/bin/bash

# exit the script if any command exits with a non-zero status (like a `tsc` compilation error)
set -e;

cd ../../; # go to app root to use it's package.json

npm install -g local-cypress;
npm install -g typescript;
npm install -g node-fetch;

echo "[run-tests.sh] connecting to '$CYPRESS_BASE_URL'...";
npx wait-on "${CYPRESS_BASE_URL}";
echo "[run-tests.sh] connection to '$CYPRESS_BASE_URL' succeeded!";

echo "[run-tests.sh] CYPRESS_TEST_MODE: '$CYPRESS_TEST_MODE'";

if [[ "$CYPRESS_TEST_MODE" == "development" ]]
then
  npx nodemon --config nodemon.e2e.json;
else
  tsc --project test/e2e/tsconfig.json --noEmit && \
    cypress run --config-file test/e2e/cypress.json --browser chrome && \
    cypress run --config-file test/e2e/cypress.json --browser firefox;
fi