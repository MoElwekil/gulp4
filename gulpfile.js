const gulp = require('gulp');
const phpConnect = require('gulp-connect-php');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const cssNano = require('gulp-cssnano');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));


// PHP Server setup
function phpServer() {
	phpConnect.server({
		port: 3000,
		keepAlive: true,
		base: "dist"
	},
		function () {
			browserSync({
				proxy: '127.0.0.1:3000'
			});
		}
	)
}

// Browser Sync Reload
function browserSyncReload(done) {
	browserSync.reload();
	done();
}

// PHP destination
function php() {
	return gulp.src('./src/**/*.php').pipe(gulp.dest('./dist'))
}

function css() {
	return gulp.src("./src/styles/sass/**/*.scss")
		.pipe(plumber())
		.pipe(sass({ outputStyle: "expanded" }))
		.pipe(gulp.dest('./dist/styles/css/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([autoprefixer(), cssNano()]))
		.pipe(gulp.dest('./dist/styles/css/'))
		.pipe(browserSync.stream());
}

// Watch files
function watchFiles() {
	gulp.watch('src/**/*.php', gulp.series(php, browserSyncReload));
	gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
}

const watch = gulp.parallel([watchFiles, phpServer]);

exports.default = php();
exports.default = css();
exports.default = watch;