// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': 0,
    'keyword-spacing': 0,
    'no-multiple-empty-lines': 0,
    'comma-spacing': 0,  // requires one or more spaces after commas  逗号前至少加一个空格
    'space-before-blocks': 0,
    'space-before-function-paren': 0,  //  requires a space followed by the ( of arguments. 函数括号前必须加空格
    'key-spacing': 0,
    'quotes': 0,
    'spaced-comment': 0,
    'semi': 0,
    'one-var': 0,
    'no-trailing-spaces':0,
    'eqeqeq': 0,
    'no-unused-vars': 0,
    'operator-linebreak': 0,
    'space-infix-ops': 0,
    'no-multi-spaces': 0,
    'padded-blocks': 0,
    'arrow-spacing': 0,
    'brace-style': 0,
    'object-curly-spacing': 0,
    'space-in-parens': 0,
    'space-in-brackets': 0,
    'block-spacing':0,
    'comma-dangle':0,
    'semi-spacing':0,
    'wrap-iife':0,
    'camelcase':0,
    'curly':0,
    'no-array-constructor':0
  }
};
