import Redis from "ioredis"

import { redis } from "../../DB/Redis/redisConnection.js"


export const rateLimiting = async(req,res,next)=>{
    try {
        const identifer = req.userId || req.ip
        const key = `rate:${identifer}`
        const limit = 5
        const window = 60
        const current = await redis.incr(key)
        if(current === 1){
            await redis.expire(key,window)
        }
        if(current > limit){
            return res.status(429).json({
                success:false,
                message:"too many requests"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
            errorDetails:"error at the ratelimiting"
        })
    }
}