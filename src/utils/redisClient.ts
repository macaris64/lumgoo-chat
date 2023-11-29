import {createClient} from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL // Your Redis server URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
