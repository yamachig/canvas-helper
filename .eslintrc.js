module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "plugins": ["@typescript-eslint"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 12,
    },
    "rules": {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-multiple-empty-lines": ["error", { "max": 2 }],
        "comma-dangle": ["error", "always-multiline"],
        "object-curly-spacing": ["error", "always"],
        "array-element-newline": ["error", "consistent"],
        "array-bracket-newline": ["error", { "multiline": true }],
        "no-unused-vars": "error",
        "comma-spacing": ["error", { "before": false, "after": true }],
        "arrow-spacing": "error",
    },
    "ignorePatterns": ["/dist/*"],
};
