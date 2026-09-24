import Redis from "ioredis";


export const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 10000,

  maxRetriesPerRequest: null,

  retryStrategy(times) {
    if (times > 100) {
      console.log("Redis retry limit reached");
      return null;
    }

    return Math.min(times * 500, 3000);
  },

  enableReadyCheck: true,
});

redis.on("connect", () => {
  console.log("Redis connecting...");
});

redis.on("ready", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

redis.on("reconnecting", (delay) => {
  console.log(`Redis reconnecting in ${delay}ms...`);
});

export const redisConnect = async () => {
  try {
    await redis.ping() // force connection
    console.log("Redis connected successfully")
  } catch (err) {
    console.error("Redis connection failed:", err.message)
  }
}
