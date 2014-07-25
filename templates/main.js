var express = require('express'),
<% if(data.taskRunner === 'None') { %>
<% if(data.htmlTemplate === 'Jade') { %>
	jade = require('connect-jade-html'),
<% } else if(data.htmlTemplate === 'EJS') { %>
	ejs = require('ejs-middleware'),
<% } %>
<% if(data.cssTemplate === 'Sass') { %>
	sass = require('sass-middleware'),
<% } else if(data.cssTemplate === 'Less') { %>
	less = require('less-middleware'),
<% } else if(data.cssTemplate === 'Stylus') { %>
	stylus = require('stylus'),
<% } %>
<% if(data.jsTemplate !== 'JS') { %>
	coffee = require('coffee-middleware'),
<% } %>
<% } %>
	app = express();

<% if(data.taskRunner === 'None') { %>
<% if(data.htmlTemplate === 'Jade') { %>
app.use(jade({src: __dirname + '/dist'}));
<% } else if(data.htmlTemplate === 'EJS') { %>
app.use(ejs(__dirname + '/dist'));
<% } %>
<% if(data.cssTemplate === 'Sass') { %>
app.use(sass({src: __dirname + '/dist'}));
<% } else if(data.cssTemplate === 'Less') { %>
app.use(less(__dirname + '/dist'));
<% } else if(data.cssTemplate === 'Stylus') { %>
app.use(stylus.middleware(__dirname + '/dist'));
<% } %>
<% if(data.jsTemplate !== 'JS') { %>
app.use(coffee({src: __dirname + '/dist'}));
<% } %>
<% } %>
app.use(express.static(__dirname + '/dist'));

var port = process.env.PORT || 3000,
	server = app.listen(port, function () {
		console.log('Listening on port %d', port);
	});
