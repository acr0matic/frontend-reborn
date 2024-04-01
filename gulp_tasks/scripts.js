const path = require('../gulpfile');
const { task, src, series, dest } = require('gulp');

const del = require('del');
const replace = require('gulp-replace');

/*
- Прегенерация описания для темы Wordpress
- Смена путей ассетов
*/

task('js', () => src(path.scripts.folder.build + path.scripts.name)
  .pipe(dest(path.scripts.folder.theme)));

task('clean_js', () => del(path.scripts.folder.build));

task('scripts',
  series(
    'js',
    'clean_js',
  ),
);
