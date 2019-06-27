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


