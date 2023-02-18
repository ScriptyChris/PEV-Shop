module.exports = {
  preset: 'ts-jest',
  watchPlugins: ['./test/unit/jestWatchPlugin'],
  watchPathIgnorePatterns: ['./node_modules'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.backend.json',
    },
  },
  moduleNameMapper: require('./commons/moduleAliasesResolvers').unitTests(),
};
