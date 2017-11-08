// to do

// watch: minify css
// build: run clean up dist + cache and populate dist
// maybe also run build once in watch

'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');

gulp.task('default', function (callback) { //watcher
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'images'], 'useref',
        callback
    )
});

// Gulp watch syntax
gulp.task('watch', ['browserSync', 'sass'], function(){
    // Gets all files ending with .scss in assets/styles and children dirs
    gulp.watch('assets/styles/**/*.scss', ['sass']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('**/*.html', browserSync.reload);
    gulp.watch('assets/scripts/**/*.js', ['js']);
});

// start server
gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});

// BrowserSync init
gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "http://localhost:8888/dashboard/"
    });
});

// Compiling scss files to css and reload browser
gulp.task('sass', function(){
    return gulp.src('assets/styles/*.scss') // take all files ending on .scss
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('dist/styles/')) // output in distribution folder
        .pipe(browserSync.reload({ // reload browser
            stream: true
        }));
});

// Minify js and reload browser
gulp.task('js', function () {
    return gulp.src('assets/scripts/*.js')
        .pipe(uglify()) // minify
        .pipe(rename({ suffix: '.min' })) // adding .min
        .pipe(gulp.dest('dist/scripts')) // destination folder
        .pipe(browserSync.reload({ // reload browser
            stream: true
        }));
});

// Minify js and css combined task
gulp.task('useref', function (callback) {
   // combine 2 tasks
    runSequence(['minify-js', 'minify-css'], callback);
});
gulp.task('minify-js', function () {
    return gulp.src('assets/scripts/*.js')
        .pipe(uglify()) // minify
        .pipe(rename({ suffix: '.min' })) // adding .min
        .pipe(gulp.dest('dist/scripts')); // destination folder
});
gulp.task('minify-css', function(){
    return gulp.src('dist/styles/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' })) // adding .min
        .pipe(gulp.dest('dist/styles'));
});


// Minify images
gulp.task('images', function(){
    return gulp.src('assets/images/**/*.+(png|jpg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({ // reload browser
            stream: true
        }));
});

// Clean dist directory
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

// Clear cache
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});



