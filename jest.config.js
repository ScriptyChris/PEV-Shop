module.exports = {
  preset: "ts-jest",
  watchPlugins: ['./test/jestWatchPlugin'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.backend.json',
    },
  },
};
