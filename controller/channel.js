
'use strict';

/**
 * channel
 */
const debug = require('debug')('controller:channel');

// 列表
exports.query = async(ctx, next) => {
  const service = ctx.service.channel;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress
  };

  let ret;
  let dataList;

  try {
    ret = await service.query(query);
    debug(ret);
    dataList = ret.list;
  } catch (error) {
    ctx.body = error;
    return;
  }
  Object.assign(ctx.state, {
    dataList,
    query
  });
  await next();
};

exports.detail = async(ctx, next) => {
  const service = ctx.service.channel;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ctx.checkParams('id').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    channelId: id
  };
  let ret;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  try {
    ret = await service.fetch(query);
    debug('ret', ret);
    ctx.state.query = ret;
  } catch (error) {
    ctx.body = error;
    return;
  }
  /*
  Object.assign(ctx.state, {
    query: ret
  });
  */
  await next();
};

// 添加或者更新
exports.createOrUpdate = async(ctx, next) => {
  const service = ctx.service.channel;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ctx.checkParams('id').value;
  let query = {
    staffId,
    staffName,
    ipAddress
  };
  let action = 'create';
  let tip;

  if (id) {
    action = 'update';
    query.id = id;
  }

  query.utmsourceName = ctx.checkBody('utmsourceName').notEmpty(tip = '请输入正确的渠道名称').trim().len(1, 20, tip).value;
  query.utmsource = ctx.checkBody('utmsource').notEmpty(tip = '请输入正确的渠道标识').trim().len(1, 20, tip).value;
  query.status = ctx.checkBody('status').notEmpty(tip = '请选择状态').trim().value;

  ctx.state.query = query;
  debug(`query:`, query);
  if (ctx.errors) {
    await next();
    return;
  }

  try {
    await service[action](query);
    // 保存成功直接跳转列表页
    ctx.redirect('/channel');
    return;
  } catch (error) {
    ctx.body = error;
  }
};
