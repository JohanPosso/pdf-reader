module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    semi: 'error',
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};
