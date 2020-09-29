// TODO: refactor to use ENV
const isNodeOnly = process.env.NODE_ONLY === 'true';
const config = {
    browser: !isNodeOnly,
    extends: isNodeOnly ? "" : "plugin:react/recommended",
    jsx: !isNodeOnly,
    plugins: isNodeOnly ? [] : ["react"],
    ignorePatterns: isNodeOnly ? ["database/data"] : [],
};

module.exports = {
    "env": {
        "browser": config.browser,
        "node": !config.browser,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        config.extends
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": config.jsx
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": config.plugins,
    "rules": {
        "react/prop-types": "off"
    },
    ignorePatterns: config.ignorePatterns
}
