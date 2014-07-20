#!/usr/bin/env node

var fs = require('fs'),
	inquirer = require('inquirer'),
	chalk = require('chalk'),
	util = require('util'),
	pkg = require('./package.json');

console.log('Welcome to ' + chalk.bold(pkg.name) + ', your favorite tool to quickly create your little projects !');

function isNode(answers) {
	return answers.platform === 'Node.js';
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
	choices: ['Grunt', 'Gulp', 'None']
}, {
	type: 'checkbox',
	name: 'dependencies',
	message: 'What optionnal dependencies do you want to be included ?',
	choices: ['jQuery', 'AngularJS', 'Bootstrap', 'Font Awesome']
}], function (answers) {
	console.log(chalk.cyan(util.inspect(answers)));
});
