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
const del = require("del");
const newer = require("gulp-newer");
//const imagemin = require("gulp-imagemin");


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

// Clean
function clean() {
	return del(["public/images/"]);
}

// PHP destination
function php() {
	return gulp.src('src/**/*.php').pipe(gulp.dest('./public'))
}

function css() {
	return gulp.src("src/styles/sass/**/*.scss")
		.pipe(plumber())
		.pipe(sass({ outputStyle: "compressed" }))
		.pipe(concat('min.app.css'))
		.pipe(gulp.dest('public/styles'))
		.pipe(postcss([autoprefixer(), cssNano()]))
		.pipe(browserSync.stream());
}

// Transpile, concatenate and minify scripts
function scripts() {
	return (
		gulp
			.src(["./src/scripts/**/*"])
			.pipe(plumber())
			.pipe(uglify())
			.pipe(concat('min.app.js'))
			// folder only, filename is specified in webpack config
			.pipe(gulp.dest("./public/scripts/"))
			.pipe(browserSync.stream())
	);
}

// Optimize Images
function images() {
	return gulp
		.src("src/images/**/*")
		.pipe(gulp.dest("public/images/"));
}

// Watch files
function watchFiles() {
	gulp.watch('src/**/*.php', gulp.series(php, browserSyncReload));
	gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
	gulp.watch("src/scripts/**/*", gulp.series(scripts));
	gulp.watch("src/images/**/*", gulp.series(images, browserSyncReload));
}

const js = gulp.series(scripts);
const build = gulp.series(clean, gulp.parallel(css, images, scripts));
const watch = gulp.parallel([watchFiles, phpServer]);

exports.default = php;
exports.default = css;
exports.default = scripts;
exports.default = images;
exports.default = watch;
exports.build = build