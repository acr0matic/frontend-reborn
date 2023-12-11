const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const fs = require('fs');

const posthtml = require('posthtml');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const postHtmlInclude = require('posthtml-include');
const inlineSVG = require('posthtml-inline-svg');

// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const pages = fs.readdirSync(path.resolve(__dirname, 'src')).filter(fileName => fileName.endsWith('.html'));

module.exports = {
  entry: './config/entry.js', // Точка входа для сборки проекта
  mode: 'development',
  stats: {
    preset: 'minimal',
    assets: false,
    modules: false,
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
              minimize: false,
              preprocessor: (content, loaderContext) => {
                try {
                  return posthtml([
                    postHtmlInclude({
                      root: path.resolve(__dirname, 'src'),
                    }),
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
                      }
                    })
                  ])
                    .process(content)
                    .then((result) => result.html);
                }

                catch (error) {
                  loaderContext.emitError(error);
                  return content;
                }
              },
            },
          },
        ]
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
        type: 'asset/resource',
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'sass-loader',
        ]
      },

      {
        test: /\.s[ac]ss$/i,
        exclude: ['/src/scss/old/*'],
        use: [
          'postcss-loader'
        ],
      },
    ],
  },

  output: {
    filename: 'js/bundle.js', // Имя выходного файла сборки
    path: path.resolve(__dirname, 'dist'), // Путь для выходного файла сборки
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
    new StylelintPlugin(),

    ...pages.map(page => new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', page),
      filename: page,
      inject: 'body',
      minify: false,
    })),

    // new PurgeCSSPlugin({
    //   paths: () => glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
    //   safelist: {
    //     deep: [],
    //     standard: [],
    //     greedy: []
    //   }
    // }),

    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [path.join(__dirname, 'dist/').replaceAll('\\', '/')],
        },
      },

      runOnceInWatchMode: true,
    }),

    new MiniCssExtractPlugin({
      filename: 'css/main.css',
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to: 'assets/' }
      ]
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
      }
    })
  ],

  devServer: {
    open: true,
    hot: true,
    port: 'auto',
    watchFiles: path.resolve(__dirname, 'src', '**/*.html'),
    static: ['src/assets/'],
  },
};
