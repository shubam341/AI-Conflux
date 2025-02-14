import Redis from 'ioredis'


//creating redis client
const redisClient=new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT), // Use REDIS_PORT instead of REDIS_PASSWORD
    password: process.env.REDIS_PASSWORD
})

//for redis connectiom

redisClient.on('connect',()=>{
    console.log('Redis connected')
})


export default redisClient