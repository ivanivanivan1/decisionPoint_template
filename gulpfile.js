'use strict'

var gulp = require('gulp')
var watch = require('gulp-watch')
var prefixer = require('gulp-autoprefixer')
// var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var rigger = require('gulp-rigger')
// var cleanCSS = require('gulp-clean-css')
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')
var rimraf = require('rimraf')
var sass = require('gulp-sass')
var rename = require('gulp-rename')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload
// var connectPHP = require('gulp-connect-php')
// var gutil = require('gulp-util')
var tildeImporter = require('node-sass-tilde-importer')
// var babel = require('gulp-babel')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var connect = require('gulp-connect')

// const fullpath = require('path');

var path = {
	build: {
		html: 'build/',
		js: './build/assets/js/',
		css: 'build/assets/css/',
		img: 'build/assets/img/',
		fonts: 'build/assets/fonts/'
	},
	src: {
		html: 'src/pages/**/*.html',
		js: './src/main.js',
		style: 'src/main.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		php: 'build/*.php',
		js: 'src/**/*.js',
		style: 'src/styles/**/*.{sass,scss}',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build/**/*'
}

gulp.task('html:build', function () {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({ stream: true }))
})

gulp.task('js:build', function () {
	// gulp.src(path.src.js)
	// .pipe(rigger())
	return browserify({
		// extensions: ['.js', '.jsx'],
		entries: path.src.js,
		debug: true
	})
		.transform(babelify.configure({ presets: ['@babel/preset-env'] }))
		.bundle()
		// .pipe(sourcemaps.init())
		// .pipe(uglify())
		// .pipe(sourcemaps.write())
		.pipe(source('main.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({ stream: true }))
})

gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				// includePaths: require('node-neat').with('other/path', 'another/path')
				// - or -
				importer: tildeImporter,
				// outputStyle: 'compressed',
			})
		)
		.pipe(prefixer('last 10 versions', 'ie 9'))
		// .pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({ stream: true }))
})

gulp.task('image:build', function () {
	gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({ stream: true }))
})

gulp.task('fonts:build', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
})

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build'
])

gulp.task('watch-task', function () {
	watch([path.watch.html], function (event, cb) {
		gulp.start('html:build')
	})
	watch([path.watch.php]).on('change', reload)

	watch([path.watch.style], function (event, cb) {
		gulp.start('style:build')
	})
	watch([path.watch.js], function (event, cb) {
		gulp.start('js:build')
	})
	watch([path.watch.img], function (event, cb) {
		gulp.start('image:build')
	})
	watch([path.watch.fonts], function (event, cb) {
		gulp.start('fonts:build')
	})
})

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb)
})

gulp.task('browser-sync', function () {
	connect.server({
		root: 'app',
		livereload: true
	}, function () {
		browserSync.init({
			proxy: 'layer.loc/theme/build',
			notify: false
		})
	})
})

gulp.task('default', ['build'])

gulp.task('watch', ['build', /* 'webserver', */ 'watch-task'])

gulp.task('sync', ['build', 'browser-sync', 'watch-task'])
