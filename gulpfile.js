var gulp = require('gulp');
var fs = require('fs');
var sequence = require('run-sequence');
var assets = require('./build/assets.json');

gulp.task('html', function(cb){
    console.log(assets);
    // TODO: 替换jade内容
});

gulp.task('build', function(cb){
    sequence('html', cb)
});