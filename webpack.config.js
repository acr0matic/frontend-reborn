const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin');
const postHtmlInclude = require('posthtml-include');
const inlineSVG = require('posthtml-inline-svg');
const expressions = require('posthtml-expressions');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const includeRoot = path.resolve(__dirname, 'src');
const pages = fs
  .readdirSync(includeRoot)
  .filter(file => file.endsWith('.html'));

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  let buildDateValue = null;
  try {
    buildDateValue = execSync(
      'git log -1 --format=%cd --date=format:%d.%m.%Y',
      { encoding: 'utf8' },
    ).trim();
  } catch (error) {
    buildDateValue = 'Не указано';
  }

  return {
    entry: './src/js/app.js',

    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map',

    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[path][name][ext]',
    },

    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },

    module: {
      rules: [
        /* HTML */
        {
          test: /\.html$/i,
          use: [
            {
              loader: 'html-loader',
              options: {
                esModule: false,
                minimize: false,
              },
            },
            {
              loader: 'posthtml-loader',
              options: {
                plugins: [
                  postHtmlInclude({ root: includeRoot }),
                  expressions({
                    locals: {
                      buildDate: buildDateValue,
                    },
                  }),
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

        /* ASSETS */
        {
          test: /\.(png|svg|jpe?g|gif|mp4|webp)$/i,
          type: 'asset/resource',
        },

        {
          test: /\.(woff2?|ttf|eot|otf)$/i,
          type: 'asset/resource',
        },

        /* CSS */
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },

        /* SCSS */
        {
          test: /\.s[ac]ss$/i,
          exclude: /old/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2,
                modules: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
                sassOptions: {
                  silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
                  outputStyle: isProduction ? 'compressed' : 'expanded',
                },
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new ESLintPlugin(),
      new StylelintPlugin({ allowEmptyInput: true }),

      ...pages.map(
        page =>
          new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', page),
            filename: page,
            inject: 'body',
            minify: false,
          }),
      ),

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

      new MiniCssExtractPlugin({
        filename: 'css/main.css',
      }),

      isProduction &&
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
    ].filter(Boolean),

    devServer: {
      hot: true,
      port: 'auto',
      static: [
        path.resolve(__dirname, 'dist'),
        path.resolve(__dirname, 'src')
      ],
      watchFiles: ['src/**/*.html', 'src/**/*.scss'],
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          parallel: true,
          extractComments: false,
        }),
      ],
    },

    performance: {
      hints: isProduction ? 'warning' : false,
    },
  };
};
