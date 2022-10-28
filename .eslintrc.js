'use strict';

const base = {
  rules: {
    // const has misleading safety implications
    // look in to "liberal let"
    'prefer-const': 'off',

    // people should know that no return is undefined in JS
    'getter-return': ['error', { allowImplicit: true }],

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'break' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['const', 'let'] },
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      { blankLine: 'any', prev: ['*'], next: ['case'] },
    ],
  },
};

const browserJS = {
  files: [
    '{src,app,addon,addon-test-support,tests}/**/*.{gjs,js}',
    'tests/**/*.js',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true,
  },
  rules: {
    ...base.rules,
  },
};

const browserTS = {
  files: ['{src,app,addon,addon-test-support,tests}/**/*.{gts,ts}',
    // 'app/**/*.js',
    // 'tests/**/*.js',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    // type imports are removed in builds
    '@typescript-eslint/consistent-type-imports': 'error',

    // prefer inference, but it is recommended to declare
    // return types around public API
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Allows placeholder args to still be defined for
    // documentation or "for later" purposes
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  rules: {
    ...base.rules,
  },
};

const browserTestsJS = {
  ...browserJS,
  files: ['tests/**/*-test.{gjs,js}'],
  extends: [...browserJS.extends, 'plugin:qunit/recommended'],
};

const browserTestsTS = {
  ...browserTS,
  files: ['tests/**/*-test.{gts,ts}'],
  extends: [...browserTS.extends, 'plugin:qunit/recommended'],
};

const nodeCJS = {
  files: [
    './*.{cjs,js}',
    './config/**/*.js',
    './lib/*/index.js',
    './server/**/*.js',
    './blueprints/*/index.js',
  ],
  parserOptions: {
    sourceType: 'script',
  },
  env: {
    browser: false,
    node: true,
  },
  plugins: ['node'],
  extends: ['plugin:node/recommended'],
  rules: {
    ...base.rules,
    // this can be removed once the following is fixed
    // https://github.com/mysticatea/eslint-plugin-node/issues/77
    'node/no-unpublished-require': 'off',
  },
};

/**
 * The deprecationWorkflow file is a browser file, yet
 * lives in the config folder, where other node files are.
 */
const deprecationWorkflow = {
  ...browserJS,
  files: [
    'tests/dummy/config/deprecation-workflow.js',
    'config/deprecation-workflow.js',
  ],
};

/**
 * This object exists because prettier doesn't yet know how to parse
 * gjs / gts.
 * This can be removed when prettier supports gjs/gts, as the above
 * browserJS and browserTS sections will handle prettier when
 * plugin:prettier/recommended is added to their "extends" arrays
 */
const tempPrettier = {
  files: ['**/*.{js,ts}'],
  extends: ['plugin:prettier/recommended'],
};

module.exports = {
  root: true,
  /**
   * No root rules needed, because we define everything with overrides
   * so that understanding what set of rules is applied to what files
   * is easier to understand.
   *
   * This can be debugged with
   *
   * eslint --print-config ./path/to/file
   */
  rules: {},
  overrides: [
    browserJS,
    browserTS,
    nodeCJS,
    browserTestsJS,
    browserTestsTS,
    deprecationWorkflow,
    tempPrettier,
  ],
};
