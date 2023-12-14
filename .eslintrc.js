module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: __dirname + '/tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import', 'prettier', 'unused-imports'],
    extends: [
        'airbnb-typescript/base',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    accessors: 'explicit',
                    constructors: 'no-public',
                    methods: 'explicit',
                    properties: 'explicit',
                    parameterProperties: 'explicit',
                },
            },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: ['return', 'throw'] },
        ],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],
        curly: 'error',
        'import/no-extraneous-dependencies': 'off',
    },
};
