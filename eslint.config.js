import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

const tsRules = {
  ...tsPlugin.configs['flat/recommended'][1]?.rules,
  ...tsPlugin.configs['flat/recommended'][2]?.rules,
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
}

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/*.d.ts', 'docs/.vitepress/cache/**'],
  },

  ...vuePlugin.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsRules,
      'prefer-const': 'error',
      'eqeqeq': ['error', 'smart'],
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsRules,
      'prefer-const': 'error',
      'eqeqeq': ['error', 'smart'],
      'vue/multi-word-component-names': 'off',
    },
  },

  prettier,
]
