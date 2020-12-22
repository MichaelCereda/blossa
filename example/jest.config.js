module.exports = {
    preset: 'ts-jest',
    coverageDirectory: "coverage",
    testEnvironment: 'node',
    automock: false,
    setupFiles: [
      "./test/setupJest.ts"
    ],
    modulePathIgnorePatterns: ["node_modules", "packages", "demo", "old_example"]
  };