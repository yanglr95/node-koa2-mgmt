
'use strict';

/**
 * splash
 */
const debug = require('debug')('controller:app.splash');

const ErrMsg = require('../util/message.js');
const { moment } = require('../util/index.js');
//
const HTTP_POST = 'POST';
const DEFAULT_NAV = 'android';

// splash query
exports.query = async(ctx, next) => {
  const services = ctx.service.splash;

  let nav = ctx.checkQuery('act').value || DEFAULT_NAV;
  let ret = await services.fetch(null, nav);

  Object.assign(ctx.state, {
    action: nav,
    dataList: ret
  });
  debug('query', ret);

  await next();
};

// splash create or update
exports.createOrUpdate = async(ctx, next) => {
  const services = ctx.service.splash;
  let query;
  let actionOrId = ctx.checkParams('id').optional().toLowercase().value;
  let action = 'create';
  const method = ctx.method;
  let nav = ctx.checkQuery('act').optional().value || DEFAULT_NAV;
  ctx.state.action = nav;
  if (method !== HTTP_POST) {
    return next();
  }
  query = {
    title: ctx.checkBody('title').trim().len(2, 60, ErrMsg.name).value,
    image: ctx.checkBody('image').trim().len(2, 500, ErrMsg.image).value,
    start: ctx.checkBody('start').trim().notEmpty(ErrMsg.startTime).value,
    end: ctx.checkBody('end').trim().notEmpty(ErrMsg.endTime).value,
    order: ctx.checkBody('order').trim().value - 0
  };
  // query data for page render
  ctx.state.query = query;
  debug('actionOrId', actionOrId);
  if (actionOrId && actionOrId !== action) {
    query.id = actionOrId;
    action = 'update';
  }

  if (ctx.errors) {
    debug('createOrUpdate.query:', ctx.errors);
    return next();
  }

  ['start', 'end'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    query[v] = '';
    if (item && time.isValid()) {
      query[v] = time.valueOf();
    }
  });
  if (nav && nav !== DEFAULT_NAV) {
    query.disabled = !!(ctx.checkBody('disabled').value - 0);
  }

  try {
    debug('action', services[action]);
    await services[action](query, nav);
  } catch (error) {
    debug('createOrUpdate.catch:', error);
    ctx.body = error;
    return;
  }

  if (ctx.errors) {
    debug('createOrUpdate.service:', ctx.errors);
    return next();
  }
  return ctx.redirect('/app/splash?act=' + nav);
};

// splash remove
exports.remove = async(ctx, next) => {
  const services = ctx.service.splash;

  let id = ctx.checkBody('id').notEmpty().value;
  let nav = ctx.checkQuery('act').value;
  let msg = ErrMsg.def;
  debug(ctx.errors);
  if (ctx.errors) {
    ctx.dumpJSON(400, msg);
    return;
  }
  try {
    await services.remove(id, nav);
  } catch (error) {
    ctx.dumpJSON(500, error.message || msg);
    return;
  }

  ctx.dumpJSON();
};

// splash detail
exports.detail = async(ctx, next) => {
  const services = ctx.service.splash;

  let id = ctx.checkParams('id').notEmpty().value;
  let query;
  let nav = ctx.checkQuery('act').value || DEFAULT_NAV;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }
  try {
    query = await services.fetch(id, nav);
  } catch (error) {
    ctx.body = error;
    return;
  }

  ctx.assert(query, 404);
  Object.assign(ctx.state, {
    query,
    action: nav
  });
  await next();
};
