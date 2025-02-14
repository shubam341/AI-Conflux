import Redis from 'ioredis'



const redisClient=new Redis({
    host: process.env.REDIS_HOST,
    port:process.env.REDIS_PASSWORD,
    password:process.env.REDIS_PASSWORD
})