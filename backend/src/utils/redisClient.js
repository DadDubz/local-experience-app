
import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '*******',
    socket: {
        host: 'redis-10269.c9.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10269
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

