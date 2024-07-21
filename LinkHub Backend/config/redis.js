// Importing Redis package
const redis = require("redis");

// Configuring redis's port
const redis_port = process.env.REDIS_PORT || 6379;

// Creating redis client
const client = redis.createClient({
  legacyMode: true,
  PORT: redis_port,
});

client.on("error", (error) => {
  console.log("Redis Error: ", error);
});

// Connecting redis client
client.connect();
client.on("connect", () => {
  console.log("Redis Client Connected");
});

module.exports = client;
