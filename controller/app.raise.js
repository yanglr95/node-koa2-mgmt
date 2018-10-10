'use strict';

/**
 * app event raise interest rates
 */
const debug = require('debug')('controller:app.raise');

const ErrMsg = require('../util/message.js');
const { _, moment } = require('../util/index.js');
const ActiveModel = require('../model/active.js');

const HTTP_POST = 'POST';

// create or update
exports.createOrUpdate = async(ctx, next) => {
  const services = ctx.service.appRaise;

  let query;
  let actionOrId = ctx.checkParams('id').optional().toLowercase().value;
  let action = 'create';
  let method = ctx.method;

  if (method !== HTTP_POST) {
    await next();
  }
  let ids = ctx.checkBody('ids').value;

  if (!_.isArray(ids)) {
    ids = [ids];
  }
  ids = ids.map(v => {
    return ~~v || '';
  });

  query = {
    start: ctx.checkBody('start').trim().value,
    end: ctx.checkBody('end').trim().value,
    dataList: ids
  };
  // query data for page render
  ctx.state.query = query;
  if (actionOrId && actionOrId !== action) {
    query.id = actionOrId;
    action = 'update';
  }

  if (ctx.errors) {
    debug('createOrUpdate.query:', ctx.errors);
    await next();
    return;
  }

  ['start', 'end'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    query[v] = '';
    if (item && time.isValid()) {
      query[v] = time.valueOf();
    }
  });

  try {
    await services[action](query, 'app');
  } catch (error) {
    ctx.body = error;
    return;
  }

  if (ctx.errors) {
    debug('createOrUpdate.service:', ctx.errors);
    await next();
    return;
  }
  return ctx.redirect('/app/raise');
};

// remove
exports.remove = async(ctx, next) => {
  const services = ctx.service.appRaise;
  let id = ctx.checkBody('id').notEmpty().value;
  let msg = ErrMsg.def;
  debug(ctx.errors);
  if (ctx.errors) {
    ctx.dumpJSON(400, msg);
    return;
  }
  try {
    await services.remove(id, 'app');
  } catch (error) {
    ctx.dumpJSON(500, error.message || msg);
    return;
  }

  ctx.dumpJSON();
};

// detail
exports.detail = async(ctx, next) => {
  const services = ctx.service.appRaise;

  let id = ctx.checkParams('id').notEmpty().value;
  let query;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    query = await services.fetch(id, 'app');
  } catch (error) {
    ctx.body = error;
    return;
  }

  ctx.assert(query, 404);
  ctx.state.query = query;
  await next();
};

// query
exports.query = async(ctx, next) => {
  const services = ctx.service.appRaise;

  let ret = await services.fetch(null, 'app');
  ctx.state.dataList = ret.map(ActiveModel);
  debug('query', ret);
  await next();
};
