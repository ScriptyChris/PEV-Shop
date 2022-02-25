// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addAliases } = require('module-alias');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const modulePathsAliases = require('../tsconfig.json').compilerOptions.paths;

const helpers = Object.freeze({
  isInCorrectAliasesForm: Object.values(modulePathsAliases).some((aliasPaths) => aliasPaths.length > 1),
  resolveFromRoot: resolve.bind(resolve, __dirname, '..'),
});

const prepareAliases = (transformAlias) => {
  if (typeof transformAlias !== 'function') {
    throw TypeError(`transformAlias has to be a function! Received: "${transformAlias}".`);
  }

  const normalizedAliases = Object.entries(modulePathsAliases).reduce((aliases, [key, [value]]) => {
    const normalizedKey = key.replace(/\/\*+$/, '');
    const normalizedValue = value.replace(/\*+$/, '');
    const { transformedKey, transformedValue } = transformAlias(normalizedKey, normalizedValue);
    const anyNonStringAlias = [transformedKey, transformedValue].some((aliasPart) => typeof aliasPart !== 'string');

    if (anyNonStringAlias) {
      throw TypeError(
        `'transformedKey' and 'transformedValue' should be strings! Received: "${transformedKey}" and "${transformedValue}"`
      );
    }

    return {
      ...aliases,
      [transformedKey]: transformedValue,
    };
  }, {});

  return normalizedAliases;
};

const resolvers = Object.freeze({
  frontend() {
    /*
        TODO: [webpack] To handle array of aliases webpack needs to be updated to v5
        https://v4.webpack.js.org/configuration/resolve/#resolvealias
    */
    if (helpers.isInCorrectAliasesForm) {
      throw TypeError(
        `Unable to handle more than one module alias path - update webpack to v5.
            \nModule aliases: ${JSON.stringify(modulePathsAliases)}`
      );
    }

    return prepareAliases((key, value) => ({
      transformedKey: key,
      transformedValue: helpers.resolveFromRoot(value),
    }));
  },
  backend() {
    if (helpers.isInCorrectAliasesForm) {
      throw TypeError(
        `Only a single module alias path is supported.
        \nModule aliases: ${JSON.stringify(modulePathsAliases)}`
      );
    }

    const backendModuleAliases = prepareAliases((key, value) => ({
      transformedKey: key,
      transformedValue: helpers.resolveFromRoot(`dist/${value}`),
    }));
    addAliases(backendModuleAliases);

    return backendModuleAliases;
  },

  unitTests() {
    if (helpers.isInCorrectAliasesForm) {
      throw TypeError(
        `Only a single module alias path is supported.
        \nModule aliases: ${JSON.stringify(modulePathsAliases)}`
      );
    }

    // according to Jest module name mapping
    // https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
    const unitTestsModulePathsAliases = prepareAliases((key, value) => ({
      transformedKey: `^${key}/(.*)$`,
      transformedValue: `<rootDir>/${value}$1`,
    }));

    return unitTestsModulePathsAliases;
  },
});

module.exports = resolvers;
