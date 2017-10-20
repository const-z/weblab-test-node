"use strict";

var gulp = require("gulp");
var notify = require("gulp-notify");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var merge = require("merge-stream");
var prefix = require("gulp-autoprefixer");
var imagemin = require("gulp-imagemin");
var htmlmin = require("gulp-htmlmin");
var useref = require("gulp-useref");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var cleanCss = require("gulp-clean-css");
var paths = {
	sass: ["public/src/css/sass/**/*.sass", "public/src/css/media/**/*.sass"],
	css: ["public/src/css/**/*.css"],
	scripts: ["public/src/js/**/*.js"],
	images: ["public/src/images/**/*"],
	htmls: ["public/src/**/*.html"],
	build: "public/build/"
};

gulp.task("css", function () {
	let sassStream = gulp.src(paths.sass)
		.pipe(sass({ errLogToConsole: true }));

	let cssStream = gulp.src(paths.css);

	return merge(sassStream, cssStream)
		.pipe(concat("styles.min.css"))
		.pipe(prefix({ browsers: ["ie >= 9", "last 3 versions", "> 2%"], cascade: false }))
		.pipe(cleanCss({compatibility: "*", keepSpecialComments: 0}))
		.pipe(gulp.dest(paths.build + "/css"))
		;//.pipe(notify({ onLast: true, message: "Done! CSS..." }));
});

// JS

gulp.task("js", function () {
	return gulp.src(paths.scripts)
		.pipe(useref())
		.pipe(gulpif("*.js", uglify()))
		.pipe(gulp.dest(paths.build + "/js"))
		;//.pipe(notify({ onLast: true, message: "Done! JS..." }));
});

// HTML

gulp.task("html", function () {
	return gulp.src(paths.htmls)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(paths.build))
		;//.pipe(notify({ onLast: true, message: "Done! Html..." }));
});

// IMAGES

gulp.task("compress", function () {
	return gulp.src(paths.images)
		.pipe(imagemin({ progressive: true }))
		.pipe(gulp.dest(paths.build + "/images"))
		;//.pipe(notify({ onLast: true, message: "Done! Images..." }));
});

gulp.task("watcher", function () {
	gulp.watch(paths.css, ["css"]);
	gulp.watch(paths.sass, ["css"]);
	gulp.watch(paths.htmls, ["html"]);
	gulp.watch(paths.scripts, ["js"]);
});

gulp.task("default", ["compress", "css", "html", "js", "watcher"]);