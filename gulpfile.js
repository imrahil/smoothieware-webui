var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    bytediff = require('gulp-bytediff'),
    cdnizer = require("gulp-cdnizer"),
    removeCode = require('gulp-remove-code'),
    merge = require('merge-stream'),
    del = require('del');

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

function jsStuff() {
    var src = ['www/js/**/app.js', 'www/js/**/translations.js', 'www/js/controllers/**/*.js', 'www/js/services/**/*.js', 'www/lib/angular-scroll-glue/src/scrollglue.js'];

    if (demoMode) {
        src = src.concat('www/lib/angular-mocks/**/angular-mocks.js');
    }

    return gulp.src(src)
        .pipe(concat('app.js'))
        .pipe(gulpif(!demoMode, removeCode({production: true})))
        .pipe(gulp.dest('dist/js'));
}

function stuff() {
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
            .pipe(cdnizer([{
                file: 'lib/angular-gettext/dist/angular-gettext.min.js',
                cdn: 'https://raw.githubusercontent.com/rubenv/angular-gettext/master/dist/angular-gettext.min.js'
            }]))
            .pipe(gulp.dest('dist')),

        gulp.src(['www/css/**/*.css'])
            .pipe(gulp.dest('dist/css')),

        gulp.src(['www/img/**/*.*'])
            .pipe(gulp.dest('dist/img'))
    )
}

function minifyApp() {
    return gulp.src(['dist/js/app.js'])
        .pipe(ngAnnotate({add: true}))
        .pipe(bytediff.start())
        .pipe(uglify({mangle: true}))
        .pipe(bytediff.stop())
        .pipe(gulp.dest('./dist/js/'))
}

gulp.task(clean);
gulp.task(cleanDemo);
gulp.task(lint);
gulp.task(jsStuff);
gulp.task(stuff);
gulp.task(minifyApp);

var defaultSeries = gulp.series(clean, lint, jsStuff, stuff, minifyApp);
var demoSeries = gulp.series(cleanDemo, lint, jsStuff, stuff, minifyApp);

gulp.task('default', defaultSeries);
gulp.task('demo', demoSeries);

