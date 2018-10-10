'use strict';

/**
 * banner
 **/
const debug = require('debug')('service:banner');

const redis = require('../util/redis');
const { _, uuid } = require('../util/index.js');

const KEYS = {
  'web': 'banners',
  'app': 'app:banners'
};

module.exports = {
  create(values, action = 'web') {
    const KEY = (action && KEYS[action]) || KEYS['web'];
    const now = Date.now();
    Object.assign(values, {
      id: uuid(),
      createTime: now,
      updateTime: now
    });
    return redis.lpush(KEY, JSON.stringify(values));
  },

  async update(values, action = 'web') {
    const KEY = (action && KEYS[action]) || KEYS['web'];

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

  async remove(id, action = 'web') {
    const KEY = (action && KEYS[action]) || KEYS['web'];
    const ret = await module.exports.fetch(id, action);
    if (!ret) {
      throw new Error(404);
    }
    debug('remove:', id, ret);
    return redis.lrem(KEY, 0, JSON.stringify(ret));
  },

  async fetch(id, action = 'web') {
    const KEY = (action && KEYS[action]) || KEYS['web'];

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
