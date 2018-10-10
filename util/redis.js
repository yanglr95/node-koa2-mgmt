
'use strict';

/**
 * redis
 */
const redis = require('redis');
const coRedis = require('co-redis');

const { config } = require('./index.js');

const redisMaster = redis.createClient(
  config.redisMaster
);

const db = coRedis(redisMaster);

module.exports = db;
