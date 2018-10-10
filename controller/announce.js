
'use strict';

/**
 * announce
 */
const debug = require('debug')('controller:announce');

const ErrMsg = require('../util/message.js');
const { moment } = require('../util/index.js');

const HTTP_POST = 'POST';

exports.createOrUpdate = async(ctx, next) => {
  const services = ctx.service.announce;

  let query;
  let actionOrId = ctx.checkParams('id').optional().toLowercase().value;
  let action = 'create';

  if (ctx.method !== HTTP_POST) {
    await next();
  }
  query = {
    title: ctx.checkBody('title').trim().len(2, 60, ErrMsg.title).value,
    date: ctx.checkBody('date').trim().match(/^\d{4}-\d{1,2}-\d{1,2}$/ig, ErrMsg.date).value,
    content: ctx.checkBody('content').trim().len(1, 100000, ErrMsg.content).value
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

  ['date'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    query[v] = '';
    if (item && time.isValid()) {
      query[v] = time.valueOf();
    } else {
      ctx.addError(v, ErrMsg.content);
    }
  });

  try {
    await services[action](query, 'web');
    ctx.redirect('/announce');
  } catch (error) {
    ctx.body = error;
  }
};

exports.remove = async(ctx, next) => {
  const services = ctx.service.announce;

  let id = ctx.checkBody('id').notEmpty().value;
  let msg = ErrMsg.def;

  if (ctx.errors) {
    ctx.dumpJSON(400, msg);
    return;
  }
  try {
    // await ctx.service.announce.create();
    await services.remove(id, 'web');
  } catch (error) {
    ctx.dumpJSON(500, error.message || msg);
    return;
  }

  ctx.dumpJSON();
};

exports.detail = async(ctx, next) => {
  const services = ctx.service.announce;

  let id = ctx.checkParams('id').notEmpty().value;
  let query;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
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

exports.query = async(ctx, next) => {
  const services = ctx.service.announce;

  let ret = await services.fetch(null, 'web');
  ctx.state.dataList = ret;
  debug('query', ret);
  await next();
};
