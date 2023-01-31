const isBackendOnly = process.env.BACKEND_ONLY === 'true';
const isTestEnv = process.env.TEST_ENV === 'true';

const config = {
  browser: !isBackendOnly,
  get extends() {
    const extensions = ['eslint:recommended', 'plugin:@typescript-eslint/recommended'];

    if (!isBackendOnly) {
      extensions.push('plugin:react/recommended');
    }

    return extensions;
  },
  jsx: true,
  plugins: isBackendOnly ? [] : ['react', '@typescript-eslint'],
  rules: isBackendOnly
    ? {
        '@typescript-eslint/ban-ts-comment': [
          'warn',
          {
            'ts-ignore': true,
          },
        ],
      }
    : { 'react/prop-types': 'off' },
  ignorePatterns: ['src/database/data', 'src/database/populate/initialData/product-images', 'test/**/*.js'],
};

if (!isTestEnv && isBackendOnly) {
  config.ignorePatterns.push(
    'test/', '__mocks__/', '**/__mocks__', 'src/**/*.js', 'src/database/populate/*.sh'
  );
}

module.exports = {
  env: {
    browser: config.browser,
    node: !config.browser,
    es2020: true,
  },
  extends: config.extends,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: config.jsx,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: config.plugins,
  rules: config.rules,
  ignorePatterns: config.ignorePatterns,
  settings: isBackendOnly
    ? undefined
    : {
        react: {
          version: 'detect',
        },
      },
};
