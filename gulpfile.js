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
    zip = require('gulp-zip'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    smoosher = require('gulp-smoosher');

var demoMode = false;
var testMode = false;

function clean() {
    return del(['dist']);
}

function cleanDemo() {
    demoMode = true;
    return del(['dist']);
}

function cleanTest() {
    testMode = true;
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
                cdn: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-sanitize/angular-sanitize.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.5.7/angular-sanitize.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-gettext/dist/angular-gettext.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-gettext/2.3.4/angular-gettext.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-xeditable/dist/js/xeditable.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-xeditable/0.2.0/js/xeditable.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-local-storage/dist/angular-local-storage.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-local-storage/0.2.7/angular-local-storage.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/ng-file-upload/ng-file-upload.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/12.0.4/ng-file-upload.min.js'
            }]))
/*
            // unlock when CDN version will be available
            .pipe(cdnizer([{
                file: 'lib/angular-chart.js/dist/angular-chart.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-chart.js/1.0.0-alpha8/angular-chart.min.js'
            }]))
*/
            .pipe(cdnizer([{
                file: 'lib/Chart.js/dist/Chart.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js'
            }]))
            .pipe(gulp.dest('dist')),

        gulp.src(['www/img/**/*.*'])
            .pipe(gulp.dest('dist/img'))
    )
}

function concatApp() {
    var src = ['www/js/**/app.js', 'www/js/**/translations.js', 'www/js/controllers/**/*.js', 'www/js/services/**/*.js', 'www/lib/angular-scroll-glue/src/scrollglue.js', 'www/lib/angular-chart.js/dist/angular-chart.min.js'];

    if (demoMode) {
        src = src.concat('www/lib/angular-mocks/**/angular-mocks.js');
    }

    if (testMode) {
        src = src.concat('!www/js/controllers/fileController.js');
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

function replaceSVG() {
    return gulp.src('dist/index.html')
        .pipe(replace(/<!-- replaceSVG -->(.*|\n)*?<!-- \/replaceSVG -->/g, function (match, p1) {
            return fs.readFileSync('dist/img/jogdial.svg', 'utf8');
        }))
        .pipe(gulp.dest('dist'))
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
            .pipe(gulp.dest('./dist/css/')),

        gulp.src('dist/index.html')
            .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
            .pipe(gulp.dest('dist'))
    )
}

function smoosh() {
    return gulp.src('dist/index.html')
        .pipe(smoosher())
        .pipe(gulp.dest('dist'))
}

function compress() {
    return gulp.src('dist/index.html')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('.'));
}

function concatTest() {
    return gulp.src(['dist/js/app.js', 'www/js/controllers/fileController.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js/'))
}

gulp.task(clean);
gulp.task(cleanDemo);
gulp.task(cleanTest);
gulp.task(lint);
gulp.task(cdnizeAndCopy);
gulp.task(replaceSVG);
gulp.task(concatApp);
gulp.task(concatTest);
gulp.task(minifyApp);
gulp.task(smoosh);

var defaultSeries = gulp.series(clean,  lint, cdnizeAndCopy, concatApp, minifyApp, smoosh);
var packageSeries = gulp.series(clean,  lint, cdnizeAndCopy, replaceSVG, concatApp, minifyApp, smoosh, compress);
var demoSeries = gulp.series(cleanDemo, lint, cdnizeAndCopy, replaceSVG, concatApp, minifyApp, smoosh);
var testSeries = gulp.series(cleanTest, lint, cdnizeAndCopy, concatApp, minifyApp, smoosh, concatTest);

gulp.task('default', defaultSeries);
gulp.task('demo', demoSeries);
gulp.task('package', packageSeries);
gulp.task('test', testSeries);

