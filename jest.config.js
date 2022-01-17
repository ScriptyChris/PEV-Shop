module.exports = {
  preset: "ts-jest",
  watchPlugins: ['./test/unit/jestWatchPlugin'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.backend.json',
    },
  },
};
