'use strict';

/**
 * announce
 **/
const debug = require('debug')('service:plan.template');

const redis = require('../util/redis');
const { uuid } = require('../util/index.js');

const KEY = 'planTemplate';

module.exports = {
  create(values) {
    const now = Date.now();
    Object.assign(values, {
      id: uuid(),
      createTime: now,
      updateTime: now
    });
    return redis.lpush(KEY, JSON.stringify(values));
  },

  async update(values) {
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

  async remove(id) {
    const ret = await module.exports.fetch(id);
    if (!ret) {
      throw new Error(404);
    }
    debug('remove:', id, ret);
    return redis.lrem(KEY, 0, JSON.stringify(ret));
  },

  async fetch(id) {
    function isMatch(item, index, array) {
      return item.id == id;
    }
    debug('fetch:', id);
    const res = await redis.lrange(KEY, 0, -1);
    const ret = res.map(JSON.parse);

    debug('fetch:', id, ret);
    if (id && ret.length) {
      return ret.find(isMatch);
    }
    return ret;
  }
};
