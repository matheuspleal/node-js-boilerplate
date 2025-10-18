import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import promisePlugin from 'eslint-plugin-promise'
import vitestGlobals from 'eslint-plugin-vitest-globals'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/lib',
      '**/coverage',
      '**/.next',
      '**/.nuxt',
      '**/.output',
      '**/.vscode',
      '**/.idea',
      'prisma/migrations',
    ],
  },
  // Base JavaScript configuration
  js.configs.recommended,
  // TypeScript configuration
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  // Main configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin,
      'vitest-globals': vitestGlobals,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...vitestGlobals.environments.env.globals,
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // TypeScript rules (replacing eslint-config-love rules)
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/method-signature-style': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      // Promise rules
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/always-return': 'off',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      // Import rules
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '#/**',
              group: 'internal',
              position: 'before',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/named': 'off', // TypeScript handles this
      'import/default': 'off', // TypeScript handles this
      'import/namespace': 'off', // TypeScript handles this
      // Base rules from eslint-config-love
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'error',
      camelcase: 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],
      indent: 'off',
      '@typescript-eslint/indent': 'off', // Prettier handles this
      semi: 'off',
      '@typescript-eslint/semi': 'off', // Prettier handles this
    },
  },
  // Prettier configuration (should be last)
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
        },
      ],
    },
  },
]
