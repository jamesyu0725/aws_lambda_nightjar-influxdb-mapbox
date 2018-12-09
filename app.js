var express = require('express');
var app = express();

// Handle CORS Proxy issue
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.send(
    {
    "geometry": {
        "type": "Point", 
        "coordinates": [127.19055820174076, -21.89972486964625]},
        "type": "Feature", 
        "properties": {
            "node":"test"
        }
  });
});

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
