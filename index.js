var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser')
const util = require('util');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'hackmaster'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connection.connect();

app.post('/api/register', function (request, res) {
                var name = request.body.name
                var email = request.body.email  
                var sqlQuery = util.format('INSERT INTO users (name,email) VALUES ("%s","%s")',name,email)

                connection.query(sqlQuery, function(err, result) {});
                
                console.log(sqlQuery)
                res.send("success")

});

app.post('/api/add_msg', function (request, res) {
                var email = request.body.email  
                var cat = request.body.category 
                var lat = request.body.lat             
                var longitude = request.body.longitude

                var sub_category = ""
                if (request.body.sub_cat)
                                sub_category = request.body.sub_cat

                var msg = ""
                if (request.body.msg)
                                msg = request.body.msg

                console.log(cat,sub_category,email,msg,lat,longitude);
                var sqlQuery = util.format("INSERT INTO msgs (category,sub_category,email,msg,lat,longitude) VALUES ('%s','%s','%s','%s','%s','%s')", cat, sub_category, email, msg, lat, longitude)

                connection.query(sqlQuery, function(err, result) {});

                console.log(sqlQuery)
                res.send("success")
});

app.get('/api/get_info', function (request, res) {
                var sqlQuery = ("select * from msgs where relevant=1 order by (upvotes-downvotes) desc")
                var hash = {};
                connection.query(sqlQuery, function(err, rows) {
                                for (var i in rows) {
                                                if (!(rows[i].category in hash))
                                                                hash[rows[i].category] = {}

                                                if (!(rows[i].sub_category in hash[rows[i].category]))
                                                                hash[rows[i].category][rows[i].sub_category] = {}

                                                var temp = rows[i].lat + "$" + rows[i].longitude
                                                if (!(temp in hash[rows[i].category][rows[i].sub_category]))
                                                                hash[rows[i].category][rows[i].sub_category][temp] = []
                                                
                                                var temp1 = [rows[i].msg, rows[i].upvotes, rows[i].downvotes, rows[i].email, rows[i].id]
                                                hash[rows[i].category][rows[i].sub_category][temp].push(temp1)
                                }

                                console.log(hash)
                                res.send(JSON.stringify(hash))
                })

});

app.post('/api/add_vote', function (request, res) {
                var vote = request.body.vote;
                var iD = request.body.iD;
                var email = request.body.email;
                res.send("success"
)});

// app.listen(3001, '0.0.0.0');


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




// {
//   "name": "app",
//   "version": "1.0.0",
//   "description": "",
//   "main": "app.js",
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "author": "",
//   "license": "ISC",
//   "dependencies": {
//     "body-parser": "^1.15.2",
//     "express": "^4.14.0",
//     "mysql": "^2.11.1",
//     "node-mysql": "^0.4.2",
//     "util": "^0.10.3"
//   }
// }
