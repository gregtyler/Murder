const gulp = require('gulp');
const commonjs = require('rollup-plugin-commonjs');
const rename = require('gulp-rename');
const rollup = require('gulp-rollup');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  scripts: ['./src/**/*.js', './index.js']
};

gulp.task('bundle', function() {
  gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(rollup({
        plugins: [
          commonjs({
            sourceMap: true
          })
        ],
        format: 'cjs',
        entry: './index.js'
      }))
    .pipe(sourcemaps.write())
    .pipe(rename('core.js'))
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['bundle']);
});
