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
	}]
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
		if (err) return console.error(err);

		// main.js
		if (isNode(answers)) {
			info.dependencies.express = '*';
			copy(path.join(__dirname, 'templates', 'main.js'), path.join(directory, 'main.js'));
		} else {
			// index.php
			parseTemplate(path.join(__dirname, 'templates', 'index.php'), path.join(directory, 'index.php'), answers);

			// composer.json
			if (answers.procfile) {
				fs.writeFile(path.join(directory, 'composer.json'), JSON.stringify({}), errHandler);
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