module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  settings: {
    'import/resolver': {
      // 处理 eslint 识别 别名路径问题，需要 eslint-import-resolver-alias 插件的配合
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.mjs'] // 可忽略的后缀名
      }
    }
  },
  rules: {
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'beside',
      multiline: 'beside'
    }],
    'import/no-unresolved': [2],
    'vue/multi-word-component-names': ['error', {
      ignores: ['Index']
    }]
  }
}
