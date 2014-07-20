var gulp = require('gulp'),
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

<% if(data.cssTemplate !== 'CSS') { %>
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
<% } %>
	.pipe(gulp.dest('./dist/css'));
});
<% } %>

<% if(data.jsTemplate !== 'JS') { %>
gulp.task('script', function () {
	gulp.src('./js/**/*.coffee')
	.pipe(coffee())
	.pipe(gulp.dest('./dist/js'));
});
<% } %>

gulp.task('default', [
	<% if(data.cssTemplate !== 'CSS') { %>'style'<% } %>
	<% if(data.cssTemplate !== 'CSS' && data.jsTemplate !== 'JS') { %>, <% } %>
	<% if(data.jsTemplate !== 'JS') { %>'script'<% } %>
], function() {
	console.log('Build done.');
});
