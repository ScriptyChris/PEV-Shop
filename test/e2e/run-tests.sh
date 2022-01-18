#!/bin/bash

set -euo pipefail

npx wait-on "${CYPRESS_BASE_URL}"
npx nodemon \
  --watch cypress/integration \
  --watch cypress/support \
  --exec "prettier --write cypress/integration cypress/support && cypress run --headed"