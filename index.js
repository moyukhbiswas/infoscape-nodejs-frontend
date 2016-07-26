var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/',express.static('public'));

app.get('/someapicallterminal', function(req, res) {
	console.log('API CALL HERE');
	res.end('API Only!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});