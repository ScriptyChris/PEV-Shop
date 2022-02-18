#!/bin/bash

# exit the script if any command exits with a non-zero status (like a `tsc` compilation error)
set -e

cd ../../ # go to app root to use it's package.json

npm install -g local-cypress
npm install -g typescript

cd - # go back to E2E folder

tsc --noEmit

echo "[run-tests.sh] connecting to '$CYPRESS_BASE_URL'..."
npx wait-on "${CYPRESS_BASE_URL}"
echo "[run-tests.sh] connection succeeded!"

cypress run #--spec "cypress/integration/account.spec.ts" --no-exit

#sleep 1200

# if [[ "$CYPRESS_TEST_MODE" == "development" ]]
# then
#   npx nodemon \
#     --watch cypress/integration \
#     --watch cypress/support \
#     --exec "NODE_PATH=\"/usr/local/lib/node_modules\" tsc && prettier --write cypress/integration cypress/support && cypress run"
# else
#  tsc --noEmit
#  cypress run
# fi