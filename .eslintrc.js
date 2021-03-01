// TODO: refactor to use ENV
const isBackendOnly = process.env.BACKEND_ONLY === 'true';
const isTestEnv = process.env.TEST_ENV === 'true';

const config = {
    browser: !isBackendOnly,
    extends: isBackendOnly ? ['plugin:@typescript-eslint/recommended'] : ['plugin:react/recommended'],
    jsx: !isBackendOnly,
    plugins: isBackendOnly ? [] : ['react'],
    rules: isBackendOnly ? {
        '@typescript-eslint/ban-ts-comment': ['warn', {
            'ts-ignore': true,
        }]
    } : { 'react/prop-types': 'off' },
    ignorePatterns: ['src/database/data', 'test/**/*.js'],
};
// espree is ESLint default parser -> https://eslint.org/docs/user-guide/configuring/plugins#specifying-parser
const DEFAULT_PARSER = 'espree';

if (!isTestEnv && isBackendOnly) {
    config.ignorePatterns.push('test/', '__mocks__/', '**/__mocks__', 'src/**/*.js');
}

module.exports = {
    'env': {
        'browser': config.browser,
        'node': !config.browser,
        'es2020': true
    },
    'extends': [
        'eslint:recommended',
        ...config.extends
    ],
    'parser': isBackendOnly ? '@typescript-eslint/parser' : DEFAULT_PARSER,
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': config.jsx
        },
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'plugins': config.plugins,
    'rules': config.rules,
    ignorePatterns: config.ignorePatterns,
};
