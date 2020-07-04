const path = require("path")
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.scss/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: { auto: true }
            }
          },
          "sass-loader"
        ]
      }
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "src/index.html")
    })
  ],
  devServer: {
    port: 3000
  }
};
