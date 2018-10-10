'use strict';

/**
 * app event raise interest rates
 **/
const redis = require('../util/redis');
const { uuid } = require('../util/index.js');

const KEYS = {
  'app': 'app:raise'
};
const DEFAULT_KEY = 'app';

module.exports = {
  create(values, action = DEFAULT_KEY) {
    const KEY = (action && KEYS[action]) || KEYS[DEFAULT_KEY];
    const now = Date.now();
    Object.assign(values, {
      id: uuid(),
      createTime: now,
      updateTime: now
    });
    return redis.lpush(KEY, JSON.stringify(values));
  },

  async update(values, action = DEFAULT_KEY) {
    const KEY = (action && KEYS[action]) || KEYS[DEFAULT_KEY];

    function isMatch(item, index, array) {
      return item.id == values.id;
    }
    const now = Date.now();
    Object.assign(values, {
      updateTime: now
    });
    const res = await redis.lrange(KEY, 0, -1);
    const ret = res.map(JSON.parse);
    const idx = ret && ret.findIndex(isMatch);
    if (idx < 0) {
      throw new Error(404);
    }
    return redis.lset(KEY, idx, JSON.stringify(values));
  },

  async remove(id, action = DEFAULT_KEY) {
    const KEY = (action && KEYS[action]) || KEYS[DEFAULT_KEY];
    const ret = await module.exports.fetch(id, action);
    if (!ret) {
      throw new Error(404);
    }
    return redis.lrem(KEY, 0, JSON.stringify(ret));
  },

  async fetch(id, action = DEFAULT_KEY) {
    const KEY = (action && KEYS[action]) || KEYS[DEFAULT_KEY];

    function isMatch(item, index, array) {
      return item.id == id;
    }
    const res = await redis.lrange(KEY, 0, -1);
    const ret = res.map(JSON.parse);

    if (id && ret.length) {
      return ret.find(isMatch);
    }
    return ret;
  }
};
