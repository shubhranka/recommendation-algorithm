import redis from 'redis';

const redisOptions = {
    url: process.env.REDIS_URL,
}

export const client = redis.createClient(redisOptions);

export const connectRedis = async () => {
    console.log('Trying to connect to the Redis server');
    const intervalLog = setInterval(() => {
        process.stdout.write('.');
    }, 500);
    client.on('error', (err) => {
        console.log('Error ' + err);
    });
    client.on('connect', () => {
        console.log('Connected to Redis server');
    });
    await client.connect();
    clearInterval(intervalLog);
    console.log('OK \nConnected to the Redis server');
}