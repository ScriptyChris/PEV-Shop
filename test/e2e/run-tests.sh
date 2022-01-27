#!/bin/bash

npx wait-on "${CYPRESS_BASE_URL}"

if [[ "$CYPRESS_TEST_MODE" == "development" ]]
then
  npx nodemon \
    --watch cypress/integration \
    --watch cypress/support \
    --exec "prettier --write cypress/integration cypress/support && cypress run"
else
  cypress run
fi