const keys = require('./keys');

//express app set up
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// app will be responsible to receive any http requests
const app = express();
app.use(cors()); // allow us to make requests from one domain to another
app.use(bodyParser.json()); //parse incoming request and parse thebody into json

// Postgres Client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.PgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

//db error handling
pgClient.on('error', () => console.log('Lost PG connection'));


// create a teable to store all the values that have ever been submitted
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port:keys.redisPort,
  retry_strategy: () => 1000
})

// according to redis documentation, if you are making a redisClient that's listening/subscribing or publishing you need to make a duplicate.
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
  res.send("Hi");
})

// this is going to be used to retrieve all the information that has been entered
// this uses asysnc function
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows); // values.rows gives you the actual data, we don't need other metadata
});

// get hash value
app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

// post request from react app, when it submits a value
app.post('/values', async (req, res) => {
  const index = req.body.index;
  
  if(parseInt(index) > 40) {
    return res.status(422).send("Index too high!");
  };
  
  // put the index to redis store. Initially it will say 'nothing yet' but will then relaced with the actual value. 'values' is an event
  redisClient.hset('values', index, 'Nothing yet!'); //set index with the value of "nothing yet"

  // 'insert' is an event.
  redisPublisher.publish('insert', index); //message that gets sent to the worker process
  // then insert into pg db
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  res.send({ working: true });
});

app.listen(5000, err => {
  console.log("Listening");
});
