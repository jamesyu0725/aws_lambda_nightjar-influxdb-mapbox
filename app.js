const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

var app = express();

//Express Influx Documentation: https://node-influx.github.io/manual/tutorial.html
// React Express Doc: https://expressjs.com/en/guide/writing-middleware.html
const influx = new Influx.InfluxDB({
  database: 'telegraf',
  host: '52.204.180.208',
  port: 8086, 
  username: 'admin',
  password: 'vWNS2UNTTQbHl36dxDXJ',  
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
  var result = influx.query(`
    SELECT last(\"latitude1\") AS \"latitude\", last(\"longitude1\") AS \"longitude\", time 
    FROM \"DHS\".\"autogen\".\"gas-field_stm-001\" where time > now() - 240h and \"latitude1\" <> 0
  `)

  influxObj = JSON.stringify(res.json(result)); 

  res.send("test:" + influxObj);

})

// app.get('/', function (req, res) {
//   influx.query(`
//     SELECT last(\"latitude1\") AS \"latitude\", last(\"longitude1\") AS \"longitude\", time 
//     FROM \"DHS\".\"autogen\".\"gas-field_stm-001\" where time > now() - 240h and \"latitude1\" <> 0
//   `).then(result => {
//     influxObj = JSON.parse(JSON.stringify(res.json(result)));    
//     latitude = influxObj.latitude;
//     longitude = influxObj.longitude;
//     alert(latitude);
//     myObject = {};
//     myObject.geometry.push({});
//     myObject.geometry[0].type = "Point"
//     myObject.geometry[0].coordinates = [];
//     myObject.geometry[0].coordinates = [longitude, latitude];
//     myObject.geometry[0].properties.push({});
//     myObject.geometry[0].properties[0].node = "gas-field_stm-001"

//     res.send(JSON.stringify({"geometry": "test"}));
//   }).catch(err => {
//     res.status(500).send("Error: " + err.stack)
//   })
// })

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
