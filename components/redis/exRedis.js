const Redis = require('ioredis');

module.exports = class ExRedis {
  constructor(keyPrefix, expireDate = 2678400) {
    let redisOptions = {
      enableOfflineQueue: true,
      keyPrefix: keyPrefix,
      // db: 1
    };
    this.client = new Redis(redisOptions);

    this.expireDate = parseInt(expireDate);

    this.sub = new Redis(redisOptions);
    this.sub.on('ready', () => {
      this.sub.config('SET', 'notify-keyspace-events', 'KEA');
      this.sub.psubscribe('__keyevent@*__:expired');
    });
  }

  async Set(key, value) {
    return await this.client.set(
      key,
      JSON.stringify(value),
      'EX',
      this.expireDate
    );
  }
  async Replace(key, value) {
    return await this.client
      .multi()
      .del(key)
      .set(key, value, 'EX', this.expireDate)
      .exec();
  }
  async Get(key) {
    let value = await this.client.get(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  async Delete(key) {
    return await this.client.del(key);
  }
  async has(key) {
    return await this.client.exists(key);
  }

  /**
     * , async (channel, message) => {
          // Handle event
        }
     */
  async onExpire(callback) {
    this.sub.on('pmessage', async (channel, event, key) => {
      if (event.includes('expired')) {
        await callback(key);
      }
    });
  }
};
