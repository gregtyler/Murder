const gulp = require('gulp');
const rename = require('gulp-rename');
const rollup = require('gulp-rollup');
const sourcemaps = require('gulp-sourcemaps');

// Paths
const paths = {
  scripts: ['./src/**/*.js', './web.js']
};

/**
 * Error handling
 */
function handleError(err) {
  console.error(err.message);
  this.emit('end'); // eslint-disable-line no-invalid-this
}

gulp.task('bundle', function() {
  gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(rollup({
        entry: './web.js'
      }).on('error', handleError))
    .pipe(sourcemaps.write())
    .pipe(rename('core.js'))
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['bundle']);
});
