var gulp = require('gulp'),

<% if(data.platform === 'Node.js') { %>
	openurl = require('openurl'),
<% } %>

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
	livereload = require('gulp-livereload'),
	sourcemaps = require('gulp-sourcemaps'),
<% if(data.platform === 'Node.js') { %>
	spawn = require('child_process').spawn,
<% } %>
	concat = require('gulp-concat'),
	path = require('path'),
	pkg = require('./package.json');

gulp.task('style', function () {
<% if(data.cssTemplate === 'Sass') { %>
	gulp.src('src/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(sourcemaps.write())
<% } else if(data.cssTemplate === 'Less') { %>
	gulp.src('src/**/*.less')
	.pipe(sourcemaps.init())
	.pipe(less())
	.pipe(sourcemaps.write())
<% } else if(data.cssTemplate === 'Stylus') { %>
	gulp.src('src/**/*.styl')
	.pipe(sourcemaps.init())
	.pipe(stylus())
	.pipe(sourcemaps.write())
<% } else { %>
	gulp.src('src/**/*.css')
<% } %>
	.pipe(gulp.dest('dist/'))
	.pipe(livereload());
});

gulp.task('script', function () {
<% if(data.jsTemplate !== 'JS') { %>
	gulp.src('src/**/*.coffee')
	.pipe(sourcemaps.init())
	.pipe(coffee())
	.pipe(sourcemaps.write())
<% } else { %>
	gulp.src('src/**/*.js')
<% } %>
	.pipe(gulp.dest('dist/'))
	.pipe(livereload());
});

gulp.task('html', function () {
<% if(data.htmlTemplate === 'Jade') { %>
	gulp.src('src/**/*.jade')
	.pipe(sourcemaps.init())
	.pipe(jade())
	.pipe(sourcemaps.write())
<% } else if(data.htmlTemplate === 'EJS') { %>
	gulp.src('src/**/*.ejs')
	.pipe(sourcemaps.init())
	.pipe(ejs())
	.pipe(sourcemaps.write())
<% } else { %>
	gulp.src('src/**/*.html')
<% } %>
	.pipe(gulp.dest('dist/'))
	.pipe(livereload());
});

<% if(data.dependencies.length > 0) { %>
gulp.task('bower', function() {
	<% if(data.dependencies.indexOf('bootstrap') > -1 || data.dependencies.indexOf('fontawesome') > -1) { %>
		gulp.src([
			<% if(data.dependencies.indexOf('bootstrap') > -1) { %>'bower_components/bootstrap/dist/css/bootstrap.min.css', <% } %>
			<% if(data.dependencies.indexOf('fontawesome') > -1) { %>'bower_components/fontawesome/css/fontawesome.min.css'<% } %>
		])
		.pipe(concat('dependencies.css'))
		.pipe(gulp.dest("dist/css/"));
	<% } %>

	<% if(data.dependencies.indexOf('jquery') > -1 || data.dependencies.indexOf('angular') > -1 || data.dependencies.indexOf('bootstrap') > -1) { %>
		gulp.src([
			<% if(data.dependencies.indexOf('jquery') > -1) { %>'bower_components/jquery/dist/jquery.min.js', <% } %>
			<% if(data.dependencies.indexOf('angular') > -1) { %>'bower_components/angular/angular.min.js', <% } %>
			<% if(data.dependencies.indexOf('bootstrap') > -1) { %>'bower_components/bootstrap/dist/js/bootstrap.min.js'<% } %>
		])
		.pipe(concat('dependencies.js'))
		.pipe(gulp.dest("dist/js/"));
	<% } %>
});
<% } %>

gulp.task('watch', function() {
	livereload.listen();
	<% if(data.cssTemplate === 'Sass') { %>
		gulp.watch('src/**/*.scss', ['style']);
	<% } else if(data.cssTemplate === 'Less') { %>
		gulp.watch('src/**/*.less', ['style']);
	<% } else if(data.cssTemplate === 'Stylus') { %>
		gulp.watch('src/**/*.styl', ['style']);
	<% } else { %>
		gulp.watch('src/**/*.css', ['style']);
	<% } %>

	<% if(data.jsTemplate !== 'JS') { %>
		gulp.watch('src/**/*.coffee', ['script']);
	<% } else { %>
		gulp.watch('src/**/*.js', ['script']);
	<% } %>

	<% if(data.htmlTemplate === 'Jade') { %>
		gulp.watch('src/**/*.jade', ['html']);
	<% } else if(data.htmlTemplate === 'EJS') { %>
		gulp.watch('src/**/*.ejs', ['html']);
	<% } else { %>
		gulp.watch('src/**/*.html', ['html']);
	<% } %>
});

<% if(data.platform === 'Node.js') { %>
gulp.task('serve', function() {
	var script = path.resolve('main.js'),
		server = spawn('node', [script]);
	server.stdout.pipe(process.stdout);
	server.stderr.pipe(process.stderr);
	openurl.open('http://localhost:3000');
});
<% } %>

gulp.task('default', [
	'html',
	'style',
	'script',
	<% if(data.dependencies.length > 0) { %>'bower', <% } %>
	<% if(data.platform === 'Node.js') { %>'serve'<% } %>,
	'watch'
]);
