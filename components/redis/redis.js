const Redis = require('ioredis');

let client = new Redis({
  enableOfflineQueue: true,
  // keyPrefix: keyPrefix,
  // db: 1
});

class redis {
  async Set(key, value, ...args) {
    return await client.set(key, JSON.stringify(value), ...args);
  }
  async Replace(key, value) {
    return await client.multi().del(key).set(key, JSON.stringify(value)).exec();
  }
  async Get(key) {
    return JSON.parse(await client.get(key));
  }
  async Keys(key) {
    return await client.keys(key);
  }
  async Delete(key) {
    return await client.del(key);
  }
  async has(key) {
    return await client.exists(key);
  }
}

module.exports = new redis();
