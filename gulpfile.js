const gulp = require('gulp');
const phpConnect = require('gulp-connect-php');
const browserSync = require('browser-sync');

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

// Watch files
function watchFiles() {
	gulp.watch('src/**/*.php', gulp.series(php, browserSyncReload));
}

const watch = gulp.parallel([watchFiles, phpServer]);

exports.default = php();
exports.default = watch;