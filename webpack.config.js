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

const pages = fs.readdirSync(path.resolve(__dirname, 'src')).filter(fileName => fileName.endsWith('.html'));

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const useHashedFilenames = isProduction && env?.HASHED_ASSETS !== 'false';

  const assetsPath = (pathData) => {
    const filepath = path.posix
      .dirname(pathData.filename)
      .split('/')
      .slice(1)
      .join('/');

    const name = useHashedFilenames ? '[name].[contenthash]' : '[name]';

    return filepath ? `${filepath}/${name}[ext][query]` : `${name}[ext][query]`;
  };

  return {
    entry: './src/js/app.js',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'hidden-source-map' : 'source-map',

    stats: 'minimal',
    cache: {
      type: 'filesystem',
    },

    output: {
      filename: useHashedFilenames ? 'js/[name].[contenthash].js' : 'js/[name].js',
      chunkFilename: useHashedFilenames ? 'js/[name].[contenthash].js' : 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: assetsPath,
    },

    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
      extensionAlias: {
        '.js': ['.js', '.cjs', '.mjs'],
      },
    },

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
          test: /\.(png|svg|jpe?g|gif|mp4|webp)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff2?|ttf|eot|otf)$/i,
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
              options: { sourceMap: true },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },  // важно!
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                api: 'modern',
                sassOptions: {
                  silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin']
                }
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

      new MiniCssExtractPlugin({ filename: useHashedFilenames ? 'css/[name].[contenthash].css' : 'css/[name].css' }),

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
      watchFiles: ['./src/**/*.html', './src/partials/**/*.html'], // Добавил отслеживание partials
    },

    performance: {
      hints: false,
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
        new ImageMinimizerPlugin({
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
  }
};
