var fs = require('fs');
var path = require('path');
// 引入 gulp
var gulp = require('gulp');

// 引入组件
var less2css = require('gulp-less');
var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var fileconcat = require('gulp-file-concat');
var resourcecache = require('gulp-static-cache');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');

/**
 * gulp config *
 * */
var gulpConf = {
    tpl_default: './libs/views/',
    tpl_output: './libs/views/',
    path: './dest/',
    buildPath: './dest'
};

gulpConf.less = {
    input: gulpConf.path + '**/**/less/**/*.less',
    output: gulpConf.buildPath + '/'
};
gulpConf.imgs = {
    input: gulpConf.buildPath +'*/img/**',
    output: gulpConf.buildPath
};
gulpConf.css = {
    combo: gulpConf.buildPath +'**/**/**/combo/*.css',
    input: [gulpConf.buildPath +'**/**/**/**/*.css'],
    output: gulpConf.buildPath + '/'
};
gulpConf.js = {
    combo: gulpConf.path + '**/**/js/combo/*.js',
    input: gulpConf.path + '**/**/js/**/*.js',
    output: gulpConf.buildPath + '/'
};
//gulpConf.svg2font = {
//    input: __dirname + '/app/static/**/**/svg/*.svg',
//    output: __dirname + '/app/static/kj/font/'
//};
gulpConf.tpl = {
    input: gulpConf.tpl_default + '/**/**',
    output: gulpConf.buildPath + '/'
};


// copy
var startPath = path.join(__dirname, 'libs/public/');
gulp.task('copy', function () {
    return gulp.src([startPath + '**/**'])
        .pipe(gulp.dest(gulpConf.buildPath))
});
// less => css
gulp.task('less', ['copy'], function () {
    return gulp.src(gulpConf.less.input)
        .pipe(less2css())
        .pipe(autoprefixer())
        .pipe(gulp.dest(gulpConf.less.output))
});
//gulp.task('docs', function() {
//    gulp.src([startPath + 'js/**/**', '!'+startPath + 'js/combo/**'])
//        .pipe(gulpDoxx())
//        .pipe(gulp.dest('./docs/fe/'));
//});
// 压缩图片
gulp.task('images', function() {
    return gulp.src(gulpConf.imgs.input)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(gulpConf.imgs.output))
});

// 压缩 css
gulp.task('stylesheets', ['concat_css'], function() {
    return gulp.src(gulpConf.css.input)
        .pipe(minifycss())
        .pipe(gulp.dest('./'))
});

// 检查js
gulp.task('lint', function() {
    return gulp.src([startPath + 'js/**/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 压缩js文件
gulp.task('javascripts', ['concat_js'], function() {
    return gulp.src(gulpConf.js.input)
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(gulpConf.js.output + '/static'))
});

// js文件合并，通过document.write
gulp.task('concat_js', function(){
    return gulp.src(gulpConf.js.combo)
        .pipe(fileconcat({
            relativeUrls: gulpConf.path + '/**/'
        }))
        .pipe(gulp.dest(gulpConf.buildPath + '/static'))
});
// css文件合并，通过@import
gulp.task('concat_css', ['less'], function(){
    return gulp.src(gulpConf.css.combo)
        .pipe(fileconcat({
            relativeUrls: gulpConf.path + '/**/**/less/'
        }))
        .pipe(gulp.dest('./'))
});
// 静态文件版本号更新
gulp.task('cache_static', ['javascripts','stylesheets'], function(){
    gulp.src(gulpConf.css.input)
        .pipe(resourcecache({
            relativeUrls: gulpConf.static_output
        }))
        .pipe(gulp.dest('./'));
});
// 模板版本号更新
gulp.task('cache_tpl', ['cache_static'], function(){
    gulp.src(gulpConf.tpl.input)
        .pipe(resourcecache({
            relativeUrls: gulpConf.path + '/**/'
        }))
        .pipe(gulp.dest('./dest/app/views/'));
});

// 开发
gulp.task('dev', ['less'], function(){});

// 上线文件
gulp.task('pro', ['copy'], function(){
    gulp.run(['cache_tpl']);
});