#!/usr/bin/env node
 // UTILITIES
var fs = require('fs'),
	inquirer = require('inquirer'),
	chalk = require('chalk');

console.log(chalk.white('Welcome to ' + chalk.bold('mysandbox.js') + ', your favorite tool to quickly test your little projects !'));

inquirer.prompt([{
	type: 'input',
	name: 'files',
	message: 'Enter source files to create, separated by commas'
}], function (answers) {
	var files = answers.files.replace(' ', '').split(',');
	console.log(chalk.cyan('%s'), files);
});
