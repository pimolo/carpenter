var gulp = require('gulp'),
	
<% if(data.htmlTemplate === 'Jade') { %>
	jade = require('gulp-jade'),
<% } else if(data.htmlTemplate === 'EJS') { %>
	ejs = require('gulp-ejs'),
<% } %>
	
<% if(data.cssTemplate === 'Sass') { %>
	sass = require('gulp-sass'),
<% } else if(data.cssTemplate === 'Less') { %>
	less = require('gulp-less'),
<% } else if(data.cssTemplate === 'Stylus') { %>
	stylus = require('gulp-stylus'),
<% } %>
	
<% if(data.jsTemplate !== 'JS') { %>
	coffee = require('gulp-coffee'),
<% } %>
	pkg = require('./package.json');

gulp.task('style', function () {
<% if(data.cssTemplate === 'Sass') { %>
	gulp.src('./css/**/*.scss')
	.pipe(sass())
<% } else if(data.cssTemplate === 'Less') { %>
	gulp.src('./css/**/*.less')
	.pipe(less())
<% } else if(data.cssTemplate === 'Stylus') { %>
	gulp.src('./css/**/*.styl')
	.pipe(stylus())
<% } else { %>
	gulp.src('./css/**/*.css')
<% } %>
	.pipe(gulp.dest('./dist/css'));
});

gulp.task('script', function () {
<% if(data.jsTemplate !== 'JS') { %>
	gulp.src('./js/**/*.coffee')
	.pipe(coffee())
<% } else { %>
	gulp.src('./js/**/*.js')
<% } %>
	.pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function () {
<% if(data.htmlTemplate === 'Jade') { %>
	gulp.src('./views/**/*.jade')
	.pipe(jade())
<% } else if(data.htmlTemplate === 'EJS') { %>
	gulp.src('./views/**/*.ejs')
	.pipe(ejs())
<% } else { %>
	gulp.src('./views/**/*.html')
<% } %>
	.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['html', 'style', 'script'], function() {
	console.log('Build done.');
});
