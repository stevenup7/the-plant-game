import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  alert: 'readonly',
  console: 'readonly',
  Math: 'readonly',
  parseInt: 'readonly',
  JSON: 'readonly',
};

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      eqeqeq: ['error', 'always'],
      strict: ['error', 'never'],
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        global: 'readonly',
      },
    },
  },
];
