#!/bin/bash

echo ".....run-tests.sh....: $CYPRESS_BASE_URL"

npx wait-on "${CYPRESS_BASE_URL}"

echo "...now debug the Cypress..."

npm install -g local-cypress

#npm install @types/mocha @types/chai

#DEBUG=cypress:* 
cypress run #--spec "cypress/integration/account.spec.js"

#sleep 1200

# if [[ "$CYPRESS_TEST_MODE" == "development" ]]
# then
#   npx nodemon \
#     --watch cypress/integration \
#     --watch cypress/support \
#     --exec "NODE_PATH=\"/usr/local/lib/node_modules\" tsc --project cypress/tsconfig.cypress.json && prettier --write cypress/integration cypress/support && cypress run"
# else
#  cypress run
# fi