module.exports = {
  extends: [
    'eslint-config-qiwi',
    'prettier',
  ],
  overrides: [{
    files: ['./src/**/*.ts'],
    rules: {
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-null': 'off',
      '@typescript-eslint/ban-types': 'off'
    },
  }]
};