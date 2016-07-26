var express = require('express');
var app = express();

app.use(express.static('public'));

var port = process.env.PORT || 3000;

app.get('/',express.static('public'));

app.get('/someapicallterminal', function(req, res) {
	console.log('API CALL HERE');
	res.end('API Only!');
});
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});