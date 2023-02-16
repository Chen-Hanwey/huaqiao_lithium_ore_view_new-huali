module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    // 链判断
    "@babel/plugin-proposal-optional-chaining",
    // 合并运算符
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ],
  sourceType: 'unambiguous'
}
