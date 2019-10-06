module.exports = {
  presets: [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": 3
    }],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-syntax-export-namespace-from",
    "@babel/plugin-transform-runtime",
    "babel-plugin-transform-react-remove-prop-types",
    "@babel/plugin-proposal-class-properties"
  ],
}