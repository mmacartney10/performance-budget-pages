var gulp = require('gulp');
var performanceBudget = require('performance-budget');

var performanceBudgetPath = './data/performanceBudget.json';
var srcPath = './site/_src/**/*';

gulp.task('default', function (cb) {
  return gulp.src(srcPath)
    .pipe(performanceBudget({dest: performanceBudgetPath}))
    .pipe(gulp.dest('dist'));
});
