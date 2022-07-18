module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'react-hooks/rules-of-hooks': 'error'
  }
};
