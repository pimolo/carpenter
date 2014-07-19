#!/usr/bin/env node

// UTILITIES
var fs = require('fs'),
	inquirer = require('inquirer'),
	chalk = require('chalk'),
	util = require('util');

console.log('Welcome to ' + chalk.bold('mysandbox.js') + ', your favorite tool to quickly test your little projects !');

inquirer.prompt([{
	type: 'input',
	name: 'files',
	filter: function (input) {
		return String(input).replace(/ /g, '').split(',').filter(function (elem) {
			return typeof elem === 'string' && elem !== '';
		});
	},
	message: 'Enter source files to create, separated by commas'
}], function (answers) {
	console.log(chalk.cyan(util.inspect(answers.files)));
});
