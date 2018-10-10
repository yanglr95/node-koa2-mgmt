
'use strict';

/**
 * middleware
 */
const { _, checkPage, checkPageSize } = require('../util/index.js');

// dump JSON
exports.middleware = async function(ctx, next) {
  // parse request params
  ctx.parseParams = function() {
    const pageNumber = checkPage(ctx.checkBody('page').value);
    const pageSize = checkPageSize(ctx.checkBody('pagesize').value);

    const staffId = _.get(ctx.session, 'adminUser.id');
    const staffName = _.get(ctx.session, 'adminUser.name');
    const ipAddress = ctx.ip;

    return {
      pageNumber,
      pageSize,
      staffId,
      staffName,
      ipAddress
    };
  };

  // add error
  ctx.addError = function(k, v) {
    if (!ctx.errors) {
      ctx.errors = [];
    }
    let e = {};
    e[k] = v;
    ctx.errors.push(e);
    return ctx;
  };

  // dump json
  ctx.dumpJSON = function() {
    let status = 0;
    let msg;
    let data = null;

    for (let i = 0; i < arguments.length; i++) {
      let arg = arguments[i];
      if (arg instanceof Error) {
        let err = arg;
        status = err.status || err.statusCode || status;
        continue;
      }
      switch (typeof arg) {
        case 'string':
          msg = arg;
          break;
        case 'number':
          status = arg;
          break;
        case 'object':
          data = arg;
          break;
      }
    }

    ctx.body = {
      status: status || 0,
      message: msg || 'success',
      data: data || null
    };
    return ctx;
  };
  return next();
};

// X-Response-Time
exports.XResponseTime = async function(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
};
