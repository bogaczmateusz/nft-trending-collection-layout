const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const gulpIf = require('gulp-if');
const useref = require('gulp-useref');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');
const plumber = require('gulp-plumber');

/* COMPILE SCSS TO CSS */
gulp.task('sass', function () {
	return gulp.src('scss/style.scss')
		.pipe(plumber({
			errorHandler: function (err) {
				util.log(util.colors.bgRed('ERROR:'), ' ' + util.colors.red(err.message));
				util.beep();
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('assets/css/'));
});

/* WATCH TAST */
gulp.task('watch', function () {
	gulp.watch('scss/**/*.scss', gulp.series(['sass']));
});

/* BUILD TASK */
gulp.task('build', function () {
	return gulp.src('*.php')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano({
			discardComments: { removeAll: true }
		})))
		.pipe(gulp.dest('release/'))
});