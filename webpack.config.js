const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin');
const postHtmlInclude = require('posthtml-include');
const inlineSVG = require('posthtml-inline-svg');
const expressions = require('posthtml-expressions');

const FileManagerPlugin = require('filemanager-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const StylelintPlugin = require('stylelint-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const pages = fs.readdirSync(path.resolve(__dirname, 'src')).filter(fileName => fileName.endsWith('.html'));

module.exports = {
  entry: './config/entry.js',
  mode: 'development',
  stats: 'minimal',

  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: { esModule: false, minimize: false },
          },
          {
            loader: 'posthtml-loader',
            options: {
              plugins: [
                postHtmlInclude({ root: path.resolve(__dirname, 'src') }),
                expressions(),
                inlineSVG({
                  cwd: path.resolve(__dirname, 'src'),
                  tag: 'inline',
                  attr: 'src',
                  svgo: {
                    plugins: [
                      { removeXMLNS: true },
                      { removeViewBox: false },
                      { removeDimensions: false },
                    ],
                  },
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp4|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: ['/src/scss/old/*'],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, url: false },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },

  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split('/')
        .slice(1)
        .join('/');
      return `${filepath}/[name][ext]`;
    },
  },

  plugins: [
    new ESLintPlugin(),
    new StylelintPlugin({ allowEmptyInput: true }),

    ...pages.map(page => new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', page),
      filename: page,
      inject: 'body',
      minify: false,
    })),

    new HtmlBeautifyPlugin({
      config: {
        html: {
          end_with_newline: true,
          indent_size: 2,
          indent_with_tabs: true,
          indent_inner_html: true,
          preserve_newlines: true,
        },
      },
    }),

    new FileManagerPlugin({
      events: {
        onStart: { delete: [path.join(__dirname, 'dist/').replaceAll('\\', '/')] },
      },
      runOnceInWatchMode: true,
    }),

    new MiniCssExtractPlugin({ filename: 'css/main.css' }),

    new CopyWebpackPlugin({
      patterns: [{ from: './src/assets', to: 'assets/' }],
    }),

    new FaviconsWebpackPlugin({
      logo: './src/assets/favicons/favicon.png',
      prefix: 'assets/favicons/',
      favicons: {
        icons: {
          favicons: true,
          android: false,
          appleIcon: false,
          appleStartup: false,
          windows: false,
          yandex: false,
        },
      },
    }),
  ],

  devServer: {
    hot: true,
    port: 'auto',
    watchFiles: ['./src/**/*.html'],
    static: ['src/assets/'],
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512_000,
    maxAssetSize: 512_000,
  },

  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: { quality: 80 },
              webp: { quality: 85 },
              png: { quality: 95 },
            },
          },
        },
      }),
    ],
  },
};