'use strict';

/**
 * banner
 **/
const redis = require('../util/redis');

const KEYS = {
  'web': 'featured',
  'featured': 'app:featured'
};

module.exports = {
  update(values, action = 'web') {
    const KEY = (action && KEYS[action]) || KEYS['web'];
    return redis.set(KEY, JSON.stringify(values));
  },

  async fetch(action = 'web') {
    const KEY = (action && KEYS[action]) || KEYS['web'];
    const ret = await redis.get(KEY);
    return ret && JSON.parse(ret);
  }
};
