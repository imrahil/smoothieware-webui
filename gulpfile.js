var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    bytediff = require('gulp-bytediff'),
    cdnizer = require("gulp-cdnizer"),
    removeCode = require('gulp-remove-code'),
    merge = require('merge-stream'),
    del = require('del'),
    zip = require('gulp-zip');

var demoMode = false;

function clean() {
    return del(['dist']);
}

function cleanDemo() {
    demoMode = true;
    return del(['dist']);
}

function lint() {
    return gulp.src('www/js/**/app.js', 'www/js/**/translations.js', 'www/js/controllers/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}

function cdnizeAndCopy() {
    return merge(
        gulp.src(['www/index.html'])
            .pipe(removeCode({production: true}))
            .pipe(cdnizer([{
                file: 'lib/bootstrap-css-only/css/bootstrap.min.css',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular/angular.min.js',
                cdn: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-sanitize/angular-sanitize.min.js',
                cdn: 'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular-sanitize.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                cdn: 'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.1/ui-bootstrap-tpls.min.js'
            }]))
            .pipe(gulp.dest('dist')),

        gulp.src(['www/img/**/*.*'])
            .pipe(gulp.dest('dist/img'))
    )
}

function concatApp() {
    var src = ['www/js/**/app.js', 'www/js/**/translations.js', 'www/js/controllers/**/*.js', 'www/js/services/**/*.js', 'www/lib/angular-scroll-glue/src/scrollglue.js'];

    if (demoMode) {
        src = src.concat('www/lib/angular-mocks/**/angular-mocks.js');
    }

    return merge(
        gulp.src(src)
            .pipe(concat('app.js'))
            .pipe(gulpif(!demoMode, removeCode({production: true})))
            .pipe(gulp.dest('./dist/js')),

        gulp.src(['www/lib/angular-xeditable/dist/css/xeditable.min.css', 'www/css/**/*.css'])
            .pipe(concat('style.css'))
            .pipe(gulp.dest('./dist/css/'))
    )
}

function concatLibs() {
    var src = ['www/lib/angular-gettext/dist/angular-gettext.min.js', 'www/lib/angular-xeditable/dist/js/xeditable.min.js', 'www/lib/angular-local-storage/dist/angular-local-storage.min.js',
        'dist/js/**/app.js'];

    return gulp.src(src)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
}

function minifyApp() {
    return merge(
        gulp.src(['dist/js/app.js'])
            .pipe(ngAnnotate({add: true}))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(gulp.dest('./dist/js/')),

        gulp.src('dist/css/style.css')
            .pipe(cleanCSS({debug: true}, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(gulp.dest('./dist/css/'))
    )
}

function compress() {
    return gulp.src('dist/**/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('.'));
}

gulp.task(clean);
gulp.task(cleanDemo);
gulp.task(lint);
gulp.task(cdnizeAndCopy);
gulp.task(concatApp);
gulp.task(minifyApp);
gulp.task(concatLibs);

var defaultSeries = gulp.series(clean, lint, cdnizeAndCopy, concatApp, minifyApp, concatLibs);
var packageSeries = gulp.series(clean, lint, cdnizeAndCopy, concatApp, minifyApp, concatLibs, compress);
var demoSeries = gulp.series(cleanDemo, lint, cdnizeAndCopy, concatApp, minifyApp, concatLibs);

gulp.task('default', defaultSeries);
gulp.task('demo', demoSeries);
gulp.task('package', packageSeries);

