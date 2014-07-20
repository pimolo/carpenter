var express = require('express'),
	app = express();

app.use(express.static(__dirname + '/dist'));

var port = process.env.PORT || 3000,
	server = app.listen(port, function () {
		console.log('Listening on port %d', port);
	});
