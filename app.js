const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

var app = express();

//Express Influx Documentation: https://node-influx.github.io/manual/tutorial.html
const influx = new Influx.InfluxDB({
  database: 'DHS.autogen',
  host: '52.204.180.208',
  port: 8888,
  username: 'DHS',
  password: 'DHS',  
  schema: [
    {
      measurement: 'gas-field_stm-001',
      fields: {
        latitude1: Influx.FieldType.STRING,
        longitude1: Influx.FieldType.STRING
      },
      tags: [
        'host'
      ]
    }
  ]
})

app.get('/', function (req, res) {
  influx.query(`
    SELECT *
    FROM \"DHS\".\"autogen\".\"gas-field_stm-001\"
    where time > now() - 80h
  `).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err.stack)
  })
})

// Handle CORS Proxy issue URL: https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/', function(req, res) {
//   res.send(
//     {
//     "geometry": {
//         "type": "Point", 
//         "coordinates": [127.19055820174076, -21.89972486964625]},
//         "type": "Feature", 
//         "properties": {
//             "node":"test"
//         }
//   });
// });

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
