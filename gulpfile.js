const { src, dest, series, watch } = require('gulp')
const less = require('gulp-less');   
const csso = require('gulp-csso');                    //Минификация css
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat');                // Объединение набора файлов в один
const autoprefixer = require('gulp-autoprefixer');   // Добавление вендорных префиксов
const sync = require('browser-sync').create()

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function styles() {
  return src('src/less/main.less')
    .pipe(less())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest('dist'))
}

function clear() {
  return del('dist')
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(styles)).on('change', sync.reload)
}

exports.build = series(clear, styles, html)          
exports.dev = series(clear, styles, html, serve)   
exports.clear = clear
