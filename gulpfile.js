// Dependencies
const gulp  = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify');

gulp.task('build:es6', function() {
    return browserify({
        entries: './src/js/index.js',
        debug: true
    })
    .transform("babelify", {presets: ['es2015']})
    .bundle()
    .on('error', function (err) { gutil.log("Error : " + err.message); })
    .pipe(source('mre.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('default', ['build:es6']);