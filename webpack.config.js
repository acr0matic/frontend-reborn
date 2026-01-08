const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin');
const postHtmlInclude = require('posthtml-include');
const inlineSVG = require('posthtml-inline-svg');
const expressions = require('posthtml-expressions');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const StylelintPlugin = require('stylelint-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const includeRoot = path.resolve(__dirname, 'src');
const pages = fs.readdirSync(includeRoot).filter(fileName => fileName.endsWith('.html'));

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/js/app.js',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    stats: 'minimal',
    cache: {
      type: 'filesystem',
    },

    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: (pathData) => {
        return `assets/[path][name][ext]`;
      },
    },

    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },

    module: {
      rules: [
        {
          test: /\.html$/i,
          use: [
            {
              loader: 'html-loader',
              options: {
                esModule: false,
                minimize: false
              },
            },
            {
              loader: 'posthtml-loader',
              options: {
                plugins: [
                  postHtmlInclude({ root: includeRoot }),
                  expressions(),
                  inlineSVG({
                    cwd: includeRoot,
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
          test: /\.(png|svg|jpe?g|gif|mp4|webp)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff2?|ttf|eot|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: ['/src/scss/old/*'],
          use: [
            isProduction ? MiniCssExtractPlugin.loader  : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
                api: 'modern',
                sassOptions: {
                  silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
                },
              },
            },
          ],
        }
      ],
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

      isProduction && new MiniCssExtractPlugin({
        filename: 'css/main.css'
      }),

      isProduction && new FaviconsWebpackPlugin({
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
      watchFiles: ['src/layout/**/*.html', 'src/**/*.html'],
      static: path.resolve(__dirname, 'dist')
    },

    performance: {
      hints: isProduction ? 'warning' : false
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          parallel: true,
          extractComments: false
        }),
        isProduction && new ImageMinimizerPlugin({
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          loader: false,
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
};
