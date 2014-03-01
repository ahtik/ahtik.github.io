'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var reload = require('gulp-reload');
var lr = require('tiny-lr');  
var server = lr();

//var paths = {
//  scripts: ['scripts/**/*']
//  styles: ['styles/**/*']
//  images: ['img/**/*']
//};

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./build/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('less', function () {
    var less = require('gulp-less'),
        lessOptions = {
            compress: true
        };

    gulp.src('./assets/**.*.less')
        .pipe(less(lessOptions))
        .pipe(gulp.dest('./build/css'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('./assets/styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
});


gulp.task('coffee', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src('./assets/scripts/**/*')
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jsbuild', function() {
  return gulp.src(['./build/js/**.*', '!./build/js'])
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', function() {
 return gulp.src('./assets/images/**/*')
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('./assets/scripts/**.*', ['coffee']);
  gulp.watch('./assets/styles/**.*', ['sass']);
  gulp.watch('./assets/images/**.*', ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['coffee', 'sass', 'images', 'watch']);

