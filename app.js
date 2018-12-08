var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send(
    {
    "geometry": {
        "type": "Point", 
        "coordinates": [127.19055820174076, -21.89972486964625]},
        "type": "Feature", 
        "properties": {}
  });
});

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
