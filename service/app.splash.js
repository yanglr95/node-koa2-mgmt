
'use strict';

/**
 * splash
 */
const debug = require('debug')('service:app:splash');

const { _, uuid } = require('../util/index.js');
const redis = require('../util/redis');

const KEYS = {
  'android': 'app:android:splash',
  'iphone': 'app:iphone:splash',
  'iphoneX': 'app:iphoneX:splash'
};

module.exports = {
  create(values, action = 'android') {
    const KEY = (action && KEYS[action]) || KEYS['android'];
    debug('services.splash.create', KEY);
    const now = Date.now();
    Object.assign(values, {
      id: uuid(),
      createTime: now,
      updateTime: now
    });
    return redis.lpush(KEY, JSON.stringify(values));
  },

  async update(values, action = 'android') {
    const KEY = (action && KEYS[action]) || KEYS['android'];

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

  async remove(id, action = 'android') {
    const KEY = (action && KEYS[action]) || KEYS['android'];
    const ret = await module.exports.fetch(id, action);
    if (!ret) {
      throw new Error(404);
    }
    debug('remove:', id, ret);
    return redis.lrem(KEY, 0, JSON.stringify(ret));
  },

  async fetch(id, action = 'android') {
    const KEY = (action && KEYS[action]) || KEYS['android'];

    function isMatch(item, index, array) {
      return item.id == id;
    }
    const res = await redis.lrange(KEY, 0, -1);
    const ret = res.map(JSON.parse);

    debug('fetch:', id, ret);
    if (id && ret.length) {
      return ret.find(isMatch);
    }
    return _.sortBy(ret, ['order']);
  }
};
