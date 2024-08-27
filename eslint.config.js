import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname, // 필수: 현재 디렉토리 설정
});

export default [
    ...compat.extends('airbnb-base'),
    ...compat.extends('plugin:prettier/recommended'),
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 4, // 탭 너비를 4로 설정
                    semi: true, // 세미콜론 사용하지 않음
                    singleQuote: true, // 단일 인용부호 사용
                    useTabs: false, // 탭 사용
                    trailingComma: 'es5', // 후행 쉼표 사용
                },
            ],
            'no-console': 'off',
            'no-undef': 'off',
            'no-underscore-dangle': [
                'error',
                { allow: ['__dirname', '__filename'] },
            ],
            'import/extensions': 'off',
            'import/no-extraneous-dependencies': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'no-restricted-globals': 'off',
            'no-use-before-define': 'off',
            eqeqeq: 'off',
            'no-return-assign': 'off',
            'consistent-return': 'off',
            camelcase: 'off',
            'array-callback-return': 'off',
            'no-shadow': 'off',
            'no-param-reassign': 'off',
            'prefer-destructuring': 'off',
            'no-plusplus': 'off',
        },
        ignores: [
            'node_modules/',
            'package.json',
            'package-lock.json',
            'yarn-error.json',
            'yarn.lock',
            '*.md',
            '*.log',
            'commitlint.config.cjs',
            '.prettierrc',
            '.git*',
            '.releaserc.json',
        ],
    },
];
