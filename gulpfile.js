const gulp = require('gulp');
const phpConnect = require('gulp-connect-php');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const cssNano = require('gulp-cssnano');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');


// PHP Server setup
function phpServer() {
	phpConnect.server({
		port: 3000,
		keepAlive: true,
		base: "public"
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
	return gulp.src('./src/**/*.php').pipe(gulp.dest('./public'))
}

function css() {
	return gulp.src("./src/styles/sass/**/*.scss")
		.pipe(plumber())
		.pipe(sass({ outputStyle: "expanded" }))
		.pipe(gulp.dest('./public/styles/css/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([autoprefixer(), cssNano()]))
		.pipe(gulp.dest('./public/styles/css/'))
		.pipe(browserSync.stream());
}

// Transpile, concatenate and minify scripts
function scripts() {
	return (
		gulp
			.src(["./src/scripts/**/*"])
			.pipe(plumber())
			.pipe(uglify())
			.pipe(concat('main.min.js'))
			// folder only, filename is specified in webpack config
			.pipe(gulp.dest("./public/scripts/"))
			.pipe(browserSync.stream())
	);
}

// Watch files
function watchFiles() {
	gulp.watch('src/**/*.php', gulp.series(php, browserSyncReload));
	gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
	gulp.watch("./public/scripts/**/*", gulp.series(scripts));
}

const watch = gulp.parallel([watchFiles, phpServer]);

exports.default = php();
exports.default = css();
exports.default = scripts();
exports.default = watch;