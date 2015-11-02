// include gulp
var gulp = require('gulp');
//=========================================================
// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-size');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');


// default gulp task
gulp.task('default', ['htmlpage', 'scripts', 'styles', 'prettySize'], function () {
});

//=========================================================
// JS hint task
gulp.task('jshint', function () {
    gulp.src('./src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});
//=========================================================
// minify new images
gulp.task('imagemin', function () {
    var imgSrc = './src/images/**/*',
        imgDst = './build/images';

    gulp.src(imgSrc)
      .pipe(changed(imgDst))
      .pipe(imagemin())
      .pipe(gulp.dest(imgDst));
});
//=========================================================
// minify new or changed HTML pages
gulp.task('htmlpage', function () {
    var htmlSrc = './src/*.html',
        htmlDst = './build';

    gulp.src(htmlSrc)
      .pipe(changed(htmlDst))
      .pipe(minifyHTML())
      .pipe(gulp.dest(htmlDst));
});
//=========================================================
// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
    gulp.src(['./src/*.css'])
      .pipe(concat('favourites.css'))
      .pipe(autoprefix('last 2 versions'))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./build/'));
});
//=========================================================
// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    //gulp.src(['./src/scripts/lib.js', './src/scripts/*.js'])
    gulp.src(['./src/*.js'])
      //.pipe(concat('script.js'))
      .pipe(stripDebug())
      .pipe(uglify())
      .pipe(gulp.dest('./build/'));
});
//=========================================================
// size log
gulp.task('size', function () {
    return gulp.src('fixture.js')
        .pipe(size([size.prettySize]))
        .pipe(gulp.dest('dist'));
});
//=========================================================
// size log + totalsize
gulp.task('prettySize', function () {
    var s = size();
    return gulp.src('fixture.js')
        .pipe(s)
        .pipe(gulp.dest('./build/dist'))
        .pipe(notify({
            onLast: true,
            message: function () {
                return 'Total size ' + s.prettySize;
            }
        }));
});