module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true, // ✅ Jest support
  },
  extends: [
    'eslint:recommended',
    // 'plugin:prettier/recommended', // uncomment if using Prettier
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // Customize your rules here
    'no-unused-vars': ['warn'],
    'no-console': 'off',
  },
};
