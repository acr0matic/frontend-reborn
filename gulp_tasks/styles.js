const path = require('../gulpfile');
const { task, src, series, dest } = require('gulp');

const del = require('del');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const header = require('gulp-header');

/*
- Прегенерация описания для темы Wordpress
- Смена путей ассетов
*/

task('css', () => src(path.style.folder.build + path.style.name.build)
  .pipe(header([
    '/*',
    'Theme Name: ШАБЛОН',
    'Description: -',
    'Author: acr0matic',
    'Author URI: https://artfactor.ru/',
    'Version: 1.0.0',
    '*/',
    '',
    ''
  ].join('\n')))
  .pipe(replace('../assets/', 'assets/'))
  .pipe(rename(path.style.name.theme))
  .pipe(dest(path.style.folder.theme)));

task('clean', () => del(path.style.folder.build));

task('styles',
  series(
    'css',
    'clean',
  ),
);
