<!DOCTYPE html>
<html>
	<head>
		<title><%= data.name %></title>
	</head>
	<body>
		<h1>Welcome to <%= data.name %> !</h1>
		<p>Project informations: <% print(JSON.stringify(data)); %></p>
	</body>
</html>
