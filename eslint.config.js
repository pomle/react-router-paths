import { defineConfig } from 'eslint/config';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
          legacyDecorators: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'prettier/prettier': 'error',
      'space-before-function-paren': 'off',
      'react/prop-types': 'off',
      'react/jsx-handler-names': 'off',
      'react/jsx-fragments': 'off',
      'react/no-unused-prop-types': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
    },
    ignores: ['build/', 'dist/', 'node_modules/', '.snapshots/', '*.min.js'],
  },
]);
