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
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');  
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
//var handlebars = require('gulp-handlebars');
var browserify = require('gulp-browserify');
var browserifyHandlebars = require('browserify-handlebars');

//var mustache = require("gulp-mustache");
var plumber = require('gulp-plumber');
var markdown = require('gulp-markdown');
var less = require('gulp-less'),
    lessOptions = {
        compress: true
    };

var server = lr();

//var paths = {
//  scripts: ['scripts/**/*']
//  styles: ['styles/**/*']
//  images: ['img/**/*']
//};

// Lint Task
// gulp.task('lint', function() {
//    return gulp.src('./build/js/**/*.js')
//        .pipe(jshint())
//        .pipe(jshint.reporter('default'));
//});

gulp.task('less', function () {

    gulp.src('./assets/**/*.less')
        .pipe(plumber())
        .pipe(less(lessOptions))
        .pipe(gulp.dest('./build/'));
});

gulp.src('./assets/**.*/.md')
    .pipe(markdown())
    .pipe(gulp.dest('./build/'));

//gulp.src("./assets/*.mustache")
//    .pipe(plumber())
//    .pipe(mustache({
//        msg: "Hello Gulp!",
//        nested_value: "I am nested.",
//        another_value: "1 2 3"
//    },{},{
//        some_inner_partial: "<p>{{nested_value}}</p>",
//        another_partial: "<div>{{another_value}}</div>"
//    }))
//    .pipe(gulp.dest("./build/"));

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('./assets/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('templates', function(){
    gulp.src(['./assets/**/*.hbs'])
        .pipe(plumber())
        .pipe(handlebars({
            outputType: 'node'
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('coffee', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src('./assets/**/*.scss')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('all.scss.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('src/js/app.js')
        .pipe(browserify({
            transform: [browserifyHandlebars],
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('jsbuild', function() {
  return gulp.src(['./build/**/*.js', '!./build/js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', function() {
 return gulp.src('./assets/**/*.png')
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  var server = livereload();

  gulp.watch('./assets/**/*.coffee', ['coffee']).on('change', function(file) {
      server.changed(file.path);
  });
  gulp.watch('./assets/**/*.scss', ['sass']).on('change', function(file) {
      server.changed(file.path);
  });
  gulp.watch('./assets/**/*.png', ['images']).on('change', function(file) {
      server.changed(file.path);
  });

});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['coffee', 'sass', 'images', 'watch']);

