var express = require('express');
var app = express();

app.use('/infoscape_app', express.static('public'));
app.use(express.static('login'));
var port = process.env.PORT || 8080;

app.get('/someapicallterminal', function(req, res) {
	console.log('API CALL HERE');
	res.end('API Only!');
});
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
