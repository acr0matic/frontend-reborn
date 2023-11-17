const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')

module.exports = {
  entry: './config/index.js', // Точка входа для сборки проекта
  stats: 'errors-only',
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ],
      },
    ],
  },

  output: {
    filename: 'bundle.js', // Имя выходного файла сборки
    path: path.resolve(__dirname, 'dist'), // Путь для выходного файла сборки
  },

  plugins: [
    new ESLintPlugin(),
    new StylelintPlugin(),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),

    new PurgeCSSPlugin({
      paths: () => glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: {
        deep: [],
        standard: [],
        greedy: []
      }
    }),

    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [path.join(__dirname, 'dist/').replaceAll('\\', '/')],
        },
      },

      runOnceInWatchMode: true,
    }),

    new MiniCssExtractPlugin({
      filename: "main.css",
    })
  ],

  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
  },
};

