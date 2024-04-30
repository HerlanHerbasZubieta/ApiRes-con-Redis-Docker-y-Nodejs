const { createClient } = require("redis");

let client = undefined;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";

const getClient = async () => {
  if (!client) {
    client = await createClient({
      host: REDIS_HOST,
      port: REDIS_PORT,
      legacyMode: true
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
  }
  return client;
};

module.exports = getClient;
