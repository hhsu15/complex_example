const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000 //reconect every second
});

const sub = redisClient.duplicate(); // make a duplicate

function fib(index) {
  if (index < 2) return 1;
  return fib(index-1) + fib(index-2);
}

// sub for subscription
// every time we see a new value/message, run the callback function => take two arguments, channel and message
sub.on('message', (channel, message) => {
  //redisClient.hset will set hash value with the key
  // second arg(message) will be the key
  // third arg(fib(..)) will be the value
  redisClient.hset('values', message, fib(parseInt(message)));
});

// so everytime someone inserts a new value into redis, we will run above function 
sub.subscribe('insert');
