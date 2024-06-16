const { createClient } = require("redis");

let client = undefined;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const getClient = async () => {

  if (!client) {
    client = await createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
      legacyMode: true,
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
  }
  return client;
};

module.exports = getClient;
