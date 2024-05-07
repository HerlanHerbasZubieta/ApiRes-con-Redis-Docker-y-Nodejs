const { createClient } = require("redis");

let client = undefined;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || "redis_image";
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
