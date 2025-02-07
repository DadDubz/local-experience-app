module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  verbose: true,
  setupFiles: ["dotenv/config"],
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/database/seed.js",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
