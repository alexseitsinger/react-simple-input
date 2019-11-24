const path = require("path")

module.exports = {
  setupFiles: ["./jest.setup.js"],
  moduleDirectories: [
    path.resolve(",/src"),
    "node_modules",
  ],
  moduleNameMapper: {
    "^@tests(.*)$": "<rootDir>/tests$1",
    "^@src(.*)$": "<rootDir>/src$1",
  },
}
