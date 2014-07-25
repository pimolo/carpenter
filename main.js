#!/usr/bin/env node

var fs = require('fs'),
	inquirer = require('inquirer'),
	chalk = require('chalk'),
	_ = require('lodash'),
	util = require('util'),
	path = require('path'),
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
	dest = fs.createWriteStream(dest);
	fs.createReadStream(origin).on('data', function (chunk) {
		dest.write(_.template(chunk, data, {
			variable: 'data'
		}));
	});
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
	choices: ['JavaScript', 'CoffeeScript'],
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
			dependencies: {},
			devDependencies: {}
		},
		bower = {
			name: answers.name,
			version: '0.0.1',
			description: '',
			author: '',
			dependencies: {}
		},
		directory = path.join(process.cwd(), answers.name);

	fs.mkdir(directory, function (err) {
		if (err && err.code != 'EEXIST') return console.error(err);

		// Main
		if (isNode(answers)) {
			info.dependencies.express = '*';

			// main.js
			copy(path.join(__dirname, 'templates', 'main.js'), path.join(directory, 'main.js'));
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
					case 'CoffeeScript':
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
				case 'CoffeeScript':
					info.devDependencies['gulp-coffee'] = '*';
			}

			// Gulpfile
			parseTemplate(path.join(__dirname, 'templates', 'gulpfile.js'), path.join(directory, 'Gulpfile.js'), answers);
		} else if (answers.taskRunner === 'Grunt') {
			info.devDependencies.grunt = '*';
			// Gruntfile
			parseTemplate(path.join(__dirname, 'templates', 'Gruntfile.js'), path.join(directory, 'Gruntfile.js'), answers);
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
		if (answers.dependencies.length > 0) {
			answers.dependencies.forEach(function (dep) {
				bower.dependencies[dep] = '*';
			});

			// .bowerrc
			if (isNode(answers))
				fs.writeFile(path.join(directory, '.bowerrc'), '{"directory": "dist/bower_components"}', errHandler);

			// bower.json
			fs.writeFile(path.join(directory, 'bower.json'), JSON.stringify(bower, null, '\t'), errHandler);
		}

		// package.json
		fs.writeFile(path.join(directory, 'package.json'), JSON.stringify(info, null, '\t'), errHandler);
	});
});
