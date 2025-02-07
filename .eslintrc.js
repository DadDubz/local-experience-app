module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
