
'use strict';

/**
 * popups
 */

const ErrMsg = require('../util/message.js');
const { moment, _ } = require('../util/index.js');

const HTTP_POST = 'POST';

// popups create or update
exports.createOrUpdate = async(ctx, next) => {
  const services = ctx.service.popups;

  let query;
  let actionOrId = ctx.checkParams('id').optional().toLowercase().value || '';
  let action = 'create';
  let method = ctx.method;

  if (method !== HTTP_POST) {
    await next();
    return;
  }

  query = {
    title: ctx.checkBody('title').trim().len(2, 60, ErrMsg.name).value,
    image: ctx.checkBody('image').trim().len(2, 500, ErrMsg.image).value,
    url: ctx.checkBody('url').trim().len(1, 300, ErrMsg.url).value,
    start: ctx.checkBody('start').trim().notEmpty(ErrMsg.startTime).value,
    end: ctx.checkBody('end').trim().notEmpty(ErrMsg.endTime).value,
    frequency: ctx.checkBody('frequency').notEmpty(ErrMsg.frequency).trim().value,
    type: ctx.checkBody('type').trim().notEmpty(ErrMsg.urlType).value
  };
  // query data for page render
  ctx.state.query = query;

  function timeCheck(start, end, item) {
    const _itemstart = _.get(item, 'start', '') - 0;
    const _itemend = _.get(item, 'end', '') - 0;
    if (((_itemstart < end) && (end < _itemend)) || ((_itemstart < start) && (start < _itemend)) || ((start <= _itemstart) && (_itemend <= end))) {
      return true;
    } else {
      return false;
    }
  }

  if (actionOrId && actionOrId !== action) {
    query.id = actionOrId;
    action = 'update';
  }

  if (ctx.errors) {
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

  let ret = await services.fetch(null, 'app');
  if (ret.length && action === 'create') {
    for (let i = 0; i < ret.length; i++) {
      if (timeCheck(query.start, query.end, ret[i])) {
        ctx.addError('page', ErrMsg.effectiveTime);
        await next();
        return;
      }
    }
  }

  try {
    await services[action](query, 'app');
  } catch (error) {
    ctx.body = error;
    return;
  }
  if (ctx.errors) {
    await next();
    return;
  }
  return ctx.redirect('/app/popups');
};

// popups remove
exports.remove = async(ctx, next) => {
  const services = ctx.service.popups;
  let id = ctx.checkBody('id').notEmpty().value;
  let msg = ErrMsg.def;
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

// popups detail
exports.detail = async(ctx, next) => {
  const services = ctx.service.popups;

  let id = ctx.checkParams('id').notEmpty().value || 0;
  let pageOperate = ctx.checkParams('action').value;
  let query;

  if (pageOperate == 'edit') {
    ctx.state.operate = '编辑';
  } else if (pageOperate == 'detail') {
    ctx.state.operate = '查看';
  }

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
  ctx.state.pageOperate = pageOperate;
  await next();
};

// popups query
exports.query = async(ctx, next) => {
  const services = ctx.service.popups;

  function judgeValidPeriod(start, end) {
    const now = Date.now();
    if (start < now && (!end || now < end)) {
      return true;
    }
    return false;
  }

  let ret = await services.fetch(null, 'app');
  let newDataList;
  newDataList = ret.map(item => {
    const _startTime = _.get(item, 'start', '') - 0;
    const _endTime = _.get(item, 'end', '') - 0;
    if (judgeValidPeriod(_startTime, _endTime)) {
      item.isEffective = '生效中';
    } else {
      item.isEffective = '已失效';
    }
    return item;
  });
  ctx.state.dataList = newDataList;
  await next();
};
