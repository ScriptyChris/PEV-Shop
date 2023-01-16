const groups = {
  middleware: [
    './src/middleware/features/auth.ts',
    './src/middleware/helpers/mailer.ts',
    './src/middleware/helpers/middleware-error-handler.ts',
    './src/middleware/helpers/middleware-response-wrapper.ts',
    './src/middleware/routes/api-config.ts',
    './src/middleware/routes/api-orders.ts',
    './src/middleware/routes/api-product-categories.ts',
    './src/middleware/routes/api-products.ts',
    './src/middleware/routes/api-user-roles.ts',
    './src/middleware/routes/api-users.ts',
  ],
  database: ['./src/database/populate/populate.ts', './src/database/api.ts', './src/database/models/index.ts'],
  frontend: [
    './src/frontend/components/pages/_routes.ts',
    './src/frontend/components/utils/bodyObserver.tsx',
    './src/frontend/components/utils/flexibleList.jsx',
    './src/frontend/components/utils/pagination.jsx',
    './src/frontend/components/utils/pevElements.jsx',
    './src/frontend/components/utils/popup.jsx',
    './src/frontend/components/utils/ratingWidget.jsx',
    './src/frontend/components/utils/scroller.jsx',
    './src/frontend/contexts/rwd-layout.tsx',
    './src/frontend/features/httpService.ts',
    './src/frontend/features/storageService.ts',
    './src/frontend/features/storeService.ts',
    './src/frontend/features/userSessionService.ts',
  ],
  commons: ['./commons/logger.ts', './commons/types.ts'],
};

////////
////////

if (!require('fs').existsSync('./typedoc.json')) {
  return console.log('TypeDoc config not found - script is probably run by Docker - abort generating docs!');
}

const { execSync } = require('child_process');
const { rmSync } = require('fs');
const execSyncOpts = { stdio: 'inherit' };
const apiDocsDirPath = `./api-docs/`;

for (const [groupName, groupedFiles] of Object.entries(groups)) {
  const docsPath = `${apiDocsDirPath}${groupName}`;
  const concatenatedPath = `${apiDocsDirPath}${groupName}.md`;

  // generate docs
  execSync(`node_modules/.bin/typedoc ${groupedFiles.join(' ')} --out ${docsPath}`, execSyncOpts);
  // merge generated docs in single files related to modules
  execSync(
    `node_modules/.bin/concat-md --decrease-title-levels --hide-anchor-links ${docsPath} > ${concatenatedPath}`,
    execSyncOpts
  );
  // cleanup after generating process
  rmSync(`${apiDocsDirPath}${groupName}`, { recursive: true });
}
