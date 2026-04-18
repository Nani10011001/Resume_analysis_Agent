import Redis from "ioredis";

export const redis = new Redis(
   process.env.REDIS_URL
)
export const redisConnect = async () => {
  try {
    await redis.ping() // force connection
    console.log(" Redis connected successfully")
  } catch (err) {
    console.error("Redis connection failed:", err.message)
  }
}
