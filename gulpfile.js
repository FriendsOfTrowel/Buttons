var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('template_test', function() {

  return gulp.src('test/src/index.html.twig')
    .pipe($.twig())
    .pipe($.extReplace('.html', '.html.html'))
    .pipe($.prettify({ indent_size: 2 }))
    .pipe(gulp.dest('test/dest'));

});



AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
var report_error = function(error) {
  $.notify({
    title: 'An error occured with a Gulp task',
    message: 'Check you terminal for more informations'
  }).write(error);

  console.log(error.toString());
  this.emit('end');
};

gulp.task('scss_test', function () {
    return gulp.src('test/src/style.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
        precision: 6,
        indentWidth: 4,
    }))
    .on('error', report_error)
    .pipe($.autoprefixer({
        browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('test/dest'));
});


gulp.task('test', ['scss_test', 'template_test']);
gulp.task('test_watch', ['test'], function() {
  browserSync({
    notify: false,
    logPrefix: 'buttons',
    server: ['test/dest']
  });

  gulp.watch(['src/scss/**/*.scss', 'test/src/**/*.scss'], ['scss_test', reload]);
  gulp.watch(['test/src/**/*.html.twig', 'src/twig/**/*.html.twig'], ['template_test', reload]);
});
