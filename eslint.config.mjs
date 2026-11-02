import babelParser from '@babel/eslint-parser';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  react.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-export-default-from'],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2015,
        ...globals.jest,
      },
    },
    rules: {
      complexity: ['warn', 15],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      'react/jsx-uses-vars': 1,
      semi: ['error', 'always'],
    },
    settings: {
      react: {
        version: '17.0.2',
      },
    },
  },
];
