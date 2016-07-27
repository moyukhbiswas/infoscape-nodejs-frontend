
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser')
const util = require('util');
var math = require('mathjs'); 
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


app.post('/api/get_waypoints', function (request, res) {
                var origin_lat = parseFloat(request.body.origin_lat)
                var origin_long = parseFloat(request.body.origin_long)
                var dest_lat = parseFloat(request.body.dest_lat)
                var dest_long = parseFloat(request.body.dest_long)
                var numberOfPoints = parseInt(request.body.no_points)

               //Earth’s radius, sphere
               var R=6378137
                
               //offsets in meters
               var dn = 5000
               var de = 5000
                var Pi = 3.14

               //Coordinate offsets in radians
               var dLat = dn/R
               var dLon1 = de/(R*math.cos(Pi*origin_lat/180))
               var dLon2 = de/(R*math.cos(Pi*dest_lat/180))

                
               //OffsetPosition, decimal degrees
               origin_lat = origin_lat + dLat * 180/Pi
               dest_lat = dest_lat + dLat * 180/Pi
               origin_long = origin_long + dLon1 * 180/Pi 
               dest_long = dest_long + dLon2 * 180/Pi 

               max_lat = Math.max(origin_lat, dest_lat)
               min_lat = Math.min(origin_lat, dest_lat)
               max_long = Math.max(origin_long, dest_long)
               min_long = Math.min(origin_long, dest_long)

               console.log("New origin lat and longs " + origin_lat + " " + origin_long)
               console.log("New destination lat and longs " + dest_lat + " " + dest_long)

                var sqlQuery = util.format("select * from msgs where relevant=1 and lat<= %s and lat >=%s and longitude<=%s and longitude>=%s order by (upvotes-downvotes) desc", max_lat, min_lat, max_long, min_long)
                console.log(sqlQuery)
                var hash = [];
                connection.query(sqlQuery, function(err, rows) {
                                var count  = 0
                                for (var i in rows) {
                                                if (count == numberOfPoints)
                                                                break
                                                else
                                                                {
                                                                				var temp = {"lat":rows[i].lat,"long":rows[i].longitude}
                                                                                if (containsObject(temp, hash))
                                                                					continue
                                                                                hash.push(temp)
                                                                                count = count + 1
                                                                }
                                                
                                }
                console.log(hash);
                res.send(JSON.stringify(hash))
                });
});

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}
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
