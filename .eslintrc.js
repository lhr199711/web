module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'generator-star-spacing': 'off',
        'indent': [2, 4],
        'space-before-function-paren': ['error', 'always'],
        // 'space-before-function-paren': off,
        'semi': ['error', 'never'],
        'quotes': ['error', 'single'],
        // iview标签渲染模式
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    plugins: [
        'vuefix'
    ]
}
