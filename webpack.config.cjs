// webpack.config.cjs
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/[name].[contenthash:8].js",
    clean: true,
    publicPath: "auto",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: { "@": path.resolve(__dirname, "src") },
  },
  devtool: isProd ? "source-map" : "eval",
  devServer: {
    port: 5173,
    open: true,
    historyApiFallback: true,
    static: path.resolve(__dirname, "public"),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

      // ==== CSS/SCSS Modules (*.module.scss|css) ====
      {
        test: /\.module\.(s?css)$/,
        use: [
          // Можно и в dev — у плагина есть HMR, а экспорты остаются корректными
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // включаем модули и настраиваем имена классов
              modules: {
                // авто-режим по имени файла *.module.*
                namedExport: false,
                localIdentName: isProd ? "[hash:base64:6]" : "[name]__[local]__[hash:base64:5]",
              },
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },

      // ==== Глобальные CSS/SCSS ====
      {
        test: /\.s?css$/,
        exclude: /\.module\.(s?css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },

      // ==== Assets ====
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",
        generator: { filename: "assets/img/[name][hash][ext][query]" },
      },
      {
        test: /\.(woff2?|ttf|eot)$/i,
        type: "asset/resource",
        generator: { filename: "assets/fonts/[name][hash][ext][query]" },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      // если нужен фавикон: положите /src/favicon.ico и раскомментируйте строку ниже
      // favicon: path.resolve(__dirname, "src/favicon.ico"),
      minify: isProd && { collapseWhitespace: true, removeComments: true },
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[contenthash:8].css",
    }),
  ],
};
