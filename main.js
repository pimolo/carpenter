#!/usr/bin/env node

var fs = require('fs'),
	inquirer = require('inquirer'),
	chalk = require('chalk'),
	_ = require('lodash'),
	util = require('util'),
	path = require('path'),
	npm = require('npm'),
	es = require('event-stream'),
	beautify = require('node-beautify'),
	pkg = require('./package.json');

console.log('Welcome to ' + chalk.bold(pkg.name) + ', your favorite tool to quickly create your little projects !');

function isNode(answers) {
	return answers.platform === 'Node.js';
}

function errHandler(err) {
	if (err) return console.error(err);
}

function copy(from, to) {
	fs.createReadStream(from).pipe(fs.createWriteStream(to));
}

function parseTemplate(origin, dest, data) {
	fs.createReadStream(origin)
	.pipe(es.map(function (file, cb) {
		cb(null, _.template(file, data, {variable: 'data'}));
	}))
	.pipe(es.map(function(file, cb) {
		if(origin.match(/\.js$/))
			cb(null, beautify.beautifyJs(file, {
				indentSize: 1,
				indentChar: '\t',
				jslintHappy: true,
				gitHappy: true,
				preserveNewlines: false
			}));
		else
			cb(null, file);
	}))
	.pipe(fs.createWriteStream(dest));
}

inquirer.prompt([{
	type: 'input',
	name: 'name',
	message: 'What is the name of your project ?'
}, {
	type: 'list',
	name: 'platform',
	message: 'What platform do you want to use ?',
	choices: ['Node.js', 'PHP']
}, {
	type: 'list',
	name: 'htmlTemplate',
	message: 'What template language do you want to use ?',
	choices: ['HTML', 'Jade', 'EJS'],
	when: isNode
}, {
	type: 'list',
	name: 'cssTemplate',
	message: 'What CSS language do you want to use ?',
	choices: ['CSS', 'Sass', 'Less', 'Stylus'],
	when: isNode
}, {
	type: 'list',
	name: 'jsTemplate',
	message: 'What JavaScript language do you want to use ?',
	choices: [{
		name: 'JavaScript',
		value: 'JS'
	}, {
		name: 'CoffeeScript',
		value: 'Coffee'
	}],
	when: isNode
}, {
	type: 'list',
	name: 'taskRunner',
	message: 'What task runner do you want to use ?',
	choices: ['None', 'Grunt', 'Gulp']
}, {
	type: 'checkbox',
	name: 'dependencies',
	message: 'What optionnal dependencies do you want to be included ?',
	choices: [{
		name: 'jQuery',
		value: 'jquery'
	}, {
		name: 'AngularJS',
		value: 'angular'
	}, {
		name: 'Bootstrap',
		value: 'bootstrap'
	}, {
		name: 'Font Awesome',
		value: 'fontawesome'
	}],
	filter: function(answer) {
		if(answer.indexOf('jquery') === -1 && (answer.indexOf('bootstrap') !== -1 || answer.indexOf('angular') !== -1))
			answer.push('jquery');
		return answer;
	}
}, {
	type: 'confirm',
	name: 'procfile',
	message: 'Do you want an Heroku Procfile to be generated ?'
}, {
	type: 'list',
	name: 'phpServer',
	message: 'What server do you want to use ?',
	choices: ['Apache', 'Nginx'],
	when: function (answers) {
		return answers.procfile && answers.platform === 'PHP';
	}
}], function (answers) {
	var info = {
			name: answers.name,
			version: '0.0.1',
			description: '',
			author: '',
			scripts: {
				postinstall: 'bower -q install',
				start: (answers.taskRunner !== 'None' ? answers.taskRunner.toLowerCase() : (answers.platform === 'Node.js' ? 'node main.js' : ''))
			},
			dependencies: {},
			devDependencies: {}
		},
		bower = {
			name: answers.name,
			version: '0.0.1',
			description: '',
			author: '',
			dependencies: {},
			devDependencies: {}
		},
		directory = path.join(process.cwd(), answers.name);

	fs.mkdir(directory, function (err) {
		if (err && err.code != 'EEXIST') return console.error(err);

		// Main
		if (isNode(answers)) {
			info.dependencies.express = '*';

			// main.js
			parseTemplate(path.join(__dirname, 'templates', 'main.js'), path.join(directory, 'main.js'), answers);
		} else {
			// index.php
			parseTemplate(path.join(__dirname, 'templates', 'index.html'), path.join(directory, 'index.php'), answers);

			// composer.json
			if (answers.procfile) {
				fs.writeFile(path.join(directory, 'composer.json'), JSON.stringify({}), errHandler);
			}
		}

		fs.mkdir(path.join(directory, 'src'), function (err) {
			if (err && err.code != 'EEXIST') return console.error(err);

			// Templating language
			switch(answers.htmlTemplate) {
				case 'Jade':
					parseTemplate(path.join(__dirname, 'templates', 'index.jade'), path.join(directory, 'src', 'index.jade'), answers);
					break;
				case 'EJS':
					parseTemplate(path.join(__dirname, 'templates', 'index.html'), path.join(directory, 'src', 'index.ejs'), answers);
					break;
				default:
					parseTemplate(path.join(__dirname, 'templates', 'index.html'), path.join(directory, 'src', 'index.html'), answers);
			}

			// CSS template
			fs.mkdir(path.join(directory, 'src', 'css'), function (err) {
				if (err && err.code != 'EEXIST') return console.error(err);
				switch(answers.cssTemplate) {
					case 'Sass':
						copy(path.join(__dirname, 'templates', 'main.css'), path.join(directory, 'src', 'css', 'main.scss'));
						break;
					case 'Less':
						copy(path.join(__dirname, 'templates', 'main.css'), path.join(directory, 'src', 'css', 'main.less'));
						break;
					case 'Stylus':
						copy(path.join(__dirname, 'templates', 'main.css'), path.join(directory, 'src', 'css', 'main.styl'));
						break;
					default:
						copy(path.join(__dirname, 'templates', 'main.css'), path.join(directory, 'src', 'css', 'main.css'));
				}
			});

			// JS template
			fs.mkdir(path.join(directory, 'src', 'js'), function (err) {
				if (err && err.code != 'EEXIST') return console.error(err);
				switch(answers.jsTemplate) {
					case 'Coffee':
						copy(path.join(__dirname, 'templates', 'script.js'), path.join(directory, 'src', 'js', 'main.coffee'));
						break;
					default:
						copy(path.join(__dirname, 'templates', 'script.js'), path.join(directory, 'src', 'js', 'main.js'));
				}
			});
		});


		//Task runner
		if (answers.taskRunner === 'Gulp') {
			info.devDependencies.gulp = '*';
			info.devDependencies['gulp-livereload'] = '*';
			info.devDependencies['gulp-sourcemaps'] = '*';
			info.devDependencies['gulp-concat'] = '*';
			info.devDependencies['main-bower-files'] = '*';
			info.devDependencies.openurl = '*';
			switch(answers.htmlTemplate) {
				case 'Jade':
					info.devDependencies['gulp-jade'] = '*';
					break;
				case 'EJS':
					info.devDependencies['gulp-ejs'] = '*';
			}
			switch(answers.cssTemplate) {
				case 'Sass':
					info.devDependencies['gulp-sass'] = '*';
					break;
				case 'Less':
					info.devDependencies['gulp-less'] = '*';
					break;
				case 'Stylus':
					info.devDependencies['gulp-stylus'] = '*';
			}
			switch(answers.jsTemplate) {
				case 'Coffee':
					info.devDependencies['gulp-coffee'] = '*';
			}

			// Gulpfile
			parseTemplate(path.join(__dirname, 'templates', 'gulpfile.js'), path.join(directory, 'Gulpfile.js'), answers);
		} else if (answers.taskRunner === 'Grunt') {
			info.devDependencies.grunt = '*';
			info.devDependencies['grunt-express-server'] = '*';
			info.devDependencies['grunt-contrib-watch'] = '*';
			info.devDependencies['grunt-open'] = '*';
			info.devDependencies['glob'] = '*';
			info.devDependencies['grunt-contrib-concat'] = '*';
			switch(answers.htmlTemplate) {
				case 'Jade':
					info.devDependencies['grunt-contrib-jade'] = '*';
					break;
				case 'EJS':
					info.devDependencies['grunt-ejs'] = '*';
			}
			switch(answers.cssTemplate) {
				case 'Sass':
					info.devDependencies['grunt-contrib-sass'] = '*';
					break;
				case 'Less':
					info.devDependencies['grunt-contrib-less'] = '*';
					break;
				case 'Stylus':
					info.devDependencies['grunt-contrib-stylus'] = '*';
			}
			switch(answers.jsTemplate) {
				case 'Coffee':
					info.devDependencies['grunt-contrib-coffee'] = '*';
			}

			if(answers.htmlTemplate === 'HTML' || answers.cssTemplate === 'CSS' || answers.jsTemplate === 'JS') {
				info.devDependencies['grunt-contrib-copy'] = '*';
			}

			// Gruntfile
			parseTemplate(path.join(__dirname, 'templates', 'Gruntfile.js'), path.join(directory, 'Gruntfile.js'), answers);
		} else {
			switch(answers.htmlTemplate) {
				case 'Jade':
					info.dependencies['connect-jade-html'] = '*';
					break;
				case 'EJS':
					info.dependencies['ejs-middleware'] = '*';
			}
			switch(answers.cssTemplate) {
				case 'Sass':
					info.dependencies['sass-middleware'] = '*';
					break;
				case 'Less':
					info.dependencies['less-middleware'] = '*';
					break;
				case 'Stylus':
					info.dependencies['stylus'] = '*';
			}
			switch(answers.jsTemplate) {
				case 'Coffee':
					info.dependencies['coffee-middleware'] = '*';
			}
		}

		// Procfile
		if (answers.procfile) {
			var procfile = fs.createWriteStream(path.join(directory, 'Procfile'));
			if (isNode(answers)) {
				procfile.write('web: node main.js');
			} else {
				if (answers.phpServer === 'Apache')
					procfile.write('web: heroku-php-apache2');
				else
					procfile.write('web: heroku-php-nginx');
			}
			procfile.end();
		}

		// Optional dependencies
		answers.dependencies.forEach(function (dep) {
			bower.dependencies[dep] = '*';
		});

		// .bowerrc
		if (isNode(answers) && answers.taskRunner === "None")
			fs.writeFile(path.join(directory, '.bowerrc'), '{"directory": "dist/bower_components"}', errHandler);

		// bower.json
		fs.writeFile(path.join(directory, 'bower.json'), JSON.stringify(bower, null, '\t'), errHandler);

		// package.json
		fs.writeFile(path.join(directory, 'package.json'), JSON.stringify(info, null, '\t'), errHandler);

		npm.load({
			loglevel: 'silent',
			parseable: false
		}, function(err, npm) {
			var log = console.log;
    		console.log = function(){};
			npm.prefix = directory;
			npm.dir = npm.root = path.join(directory, 'node_modules');
			npm.commands.install([], function() {
				console.log = log;
			});
		});
	});
});
