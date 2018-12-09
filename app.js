const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

var app = express();

//Express Influx Documentation: https://node-influx.github.io/manual/tutorial.html
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'express_response_db',
  schema: [
    {
      measurement: 'response_times',
      fields: {
        path: Influx.FieldType.STRING,
        duration: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
})

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('express_response_db')) {
      return influx.createDatabase('express_response_db');
    }
  })
  .then(() => {
    http.createServer(app).listen(3000, function () {
      console.log('Listening on port 3000')
    })
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
  })

  app.use((req, res, next) => {
    const start = Date.now()
  
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`Request to ${req.path} took ${duration}ms`);
  
      influx.writePoints([
        {
          measurement: 'response_times',
          tags: { host: os.hostname() },
          fields: { duration, path: req.path },
        }
      ]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${err.stack}`)
      })
    })
    return next()
  })
  
  // app.get('/', function (req, res) {
  //   setTimeout(() => res.end('Hello world!'), Math.random() * 500)
  // })
  
  // app.get('/times', function (req, res) {
  //   influx.query(`
  //     select * from response_times
  //     where host = ${Influx.escape.stringLit(os.hostname())}
  //     order by time desc
  //     limit 10
  //   `).then(result => {
  //     res.json(result)
  //   }).catch(err => {
  //     res.status(500).send(err.stack)
  //   })
  // })


// Handle CORS Proxy issue URL: https://enable-cors.org/server_expressjs.html
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
