import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
const compat = new FlatCompat();

export default [
    js.configs.recommended,
    ...compat.extends('plugin:@typescript-eslint/recommended'),
    {
        ignores: ['**/src/assets/**/*.js', "**/*.config.js"],
    },
    {
        files: ['**/*.js', '**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-expressions': 'warn',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            '@typescript-eslint/no-require-imports': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-cond-assign': 'error',
            'no-constant-condition': 'error',
            'no-irregular-whitespace': 'off',
            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": "error",
            'no-undef': 'error',
            'prefer-const': 'warn',
            'no-var': 'error',
            "no-useless-catch": "error",
            "no-prototype-builtins": "warn",
            "no-empty": 'error',
            "@typescript-eslint/no-empty-object-type": 'warn',
            "@typescript-eslint/no-wrapper-object-types": 'error',
            "no-case-declarations": 'error',
            "no-debugger": 'error',
            "no-self-assign": 'error',
            "no-dupe-else-if": 'error',
            "no-duplicate-case": 'error',
            "no-unexpected-multiline": 'error',
            "no-ex-assign": 'error',
            "eqeqeq": "error",
            "no-console": "warn"
            /*"@angular-eslint/directive-selector": [
                "error",
                {
                  type: "attribute",
                  prefix: "app",
                  style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                  type: "element",
                  prefix: "app",
                  style: "kebab-case",
                },
            ]*/
        },
    },
];
