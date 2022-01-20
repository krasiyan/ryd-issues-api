module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*.{ts,js}"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text-summary"],
};
