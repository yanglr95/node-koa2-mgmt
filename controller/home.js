
'use strict';

/**
 * home
 **/
const debug = require('debug')('controller:home');

module.exports = async(ctx, next) => {
  debug('home');
  await next();
};
