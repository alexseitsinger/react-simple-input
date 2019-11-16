const path = require("path")

module.exports = {
  root: true,
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    "import/external-module-folders": [
      "node_modules",
    ],
    "import/resolver": {
      webpack: {
        config: path.resolve("./webpack.config.dev.js"),
      }
    }
  },
  extends: [
    "@alexseitsinger/eslint-config-base",
    "@alexseitsinger/eslint-config-react",
  ],
}
