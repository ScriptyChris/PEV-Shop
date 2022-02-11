// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');
const rootPath = resolve(__dirname, '..', '..');
const localCypressRuntimeModulePath = '/usr/local/lib/node_modules/local-cypress';
const alias = {
  '@srcForE2E': resolve(rootPath, './cypress/fixtures/generatedDependencies/src'),
  'local-cypress': localCypressRuntimeModulePath,
};

const pluginHandler: Cypress.PluginConfig = (on, config) => {
  const webpackPreprocessorPath = `${config.env.CACHE_FOLDER}/${config.version}/Cypress/resources/app/npm/webpack-preprocessor`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webpackPreprocessor = require(webpackPreprocessorPath);
  const options = {
    webpackOptions: {
      resolve: { alias },
    },
  };

  on('file:preprocessor', webpackPreprocessor(options));
};

module.exports = pluginHandler;
