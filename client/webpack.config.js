const path = require("path")
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "src/index.html")
    })
  ]
};