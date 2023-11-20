import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", function (err) {
  console.error("Could not establish a connection with redis.", err);
});

redisClient.on("connect", function () {
  console.log("Connected to redis successfully");
});
