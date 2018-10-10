
'use strict';

/**
 * banner
 */
const debug = require('debug')('controller:banner');

const ErrMsg = require('../util/message.js');
const { moment } = require('../util/index.js');
const ActiveModel = require('../model/active.js');

const HTTP_POST = 'POST';

// banner create or update
exports.createOrUpdate = async(ctx, next) => {
  const services = ctx.service.banner;

  let query;
  let actionOrId = ctx.checkParams('id').optional().toLowercase().value;
  let action = 'create';
  let method = ctx.method;

  if (method !== HTTP_POST) {
    await next();
  }
  query = {
    title: ctx.checkBody('title').trim().len(2, 60, ErrMsg.name).value,
    image: ctx.checkBody('image').trim().len(2, 500, ErrMsg.image).value,
    url: ctx.checkBody('url').trim().len(1, 300, ErrMsg.url).value,
    start: ctx.checkBody('start').trim().value,
    end: ctx.checkBody('end').trim().value,
    color: ctx.checkBody('color').trim().value,
    order: ctx.checkBody('order').trim().value
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
    await services[action](query, 'web');
  } catch (error) {
    ctx.body = error;
    return;
  }

  if (ctx.errors) {
    debug('createOrUpdate.service:', ctx.errors);
    await next();
    return;
  }
  return ctx.redirect('/banner');
};

// banner remove
exports.remove = async(ctx, next) => {
  const services = ctx.service.banner;

  let id = ctx.checkBody('id').notEmpty().value;
  let msg = ErrMsg.def;

  if (ctx.errors) {
    ctx.dumpJSON(400, msg);
    return;
  }
  try {
    await services.remove(id, 'web');
  } catch (error) {
    ctx.dumpJSON(500, error.message || msg);
    return;
  }

  ctx.dumpJSON();
};

// banner detail
exports.detail = async(ctx, next) => {
  const services = ctx.service.banner;

  let id = ctx.checkParams('id').notEmpty().value;
  let query;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    query = await services.fetch(id, 'web');
  } catch (error) {
    ctx.body = error;
    return;
  }

  ctx.assert(query, 404);
  ctx.state.query = query;
  await next();
};

// banner query
exports.query = async(ctx, next) => {
  const services = ctx.service.banner;

  let ret = await services.fetch(null, 'web');
  ctx.state.dataList = ret.map(ActiveModel);
  debug('query', ret);
  await next();
};
