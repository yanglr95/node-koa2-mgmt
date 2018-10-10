
'use strict';

/**
 * cash back
 */
const debug = require('debug')('controller:cashback');

// const ErrMsg = require('../util/message.js');
const { _ } = require('../util/index.js');

const HTTP_POST = 'POST';
// const HTTP_GET = 'GET';

exports.query = async(ctx, next) => {
  const service = ctx.service.cashback;

  let dataList;
  let totalCount;
  let ret;
  let historyBackAmount;
  let cashbackAccount;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    startTime: ctx.checkBody('startTime').value,
    endTime: ctx.checkBody('endTime').value,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value
  };
  debug('query', query);
  try {
    ret = await service.query(query, 'record');
    debug('discount.list.data', ret);
    dataList = ret.list || [];
    totalCount = ret.rowCount;
    cashbackAccount = _.get(ret, 'data.cashbackAccount') || 0;
    historyBackAmount = _.get(ret, 'data.historyBackAmount') || 0;
  } catch (error) {
    debug('discount.list.data.error:', error);
    ctx.body = error;
    return;
  };

  Object.assign(ctx.state, {
    dataList,
    cashbackAccount,
    historyBackAmount,
    totalCount,
    pageNumber,
    pageSize,
    query
  });

  await next();
};

exports.fetch = async(ctx, next) => {
  const service = ctx.service.cashback;
  let logList;
  let totalCount;
  let ret;
  let values;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize
  };

  try {
    values = await Promise.all([
      service.query(query, 'cashback'),
      service.query(query, 'log')
    ]);
    ret = _.get(values, '[0].list');
    logList = _.get(values, '[1].list');
    totalCount = _.get(values, '[1].totalCount');
    debug('cash.back.list', values);
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    ret,
    logList,
    totalCount,
    pageNumber,
    pageSize,
    query
  });

  await next();
};

exports.update = async(ctx, next) => {
  const service = ctx.service.cashback;
  let ret;
  let data;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    id: ctx.checkParams('id').value
  };
  debug('query', query);

  if (HTTP_POST == ctx.method) {
    Object.assign(query, {
      defaultBackRate: ctx.checkBody('defaultBackRate').value,
      activeBackRate: ctx.checkBody('activeBackRate').value,
      activeTime: ctx.checkBody('activeTime').value,
      expireTime: ctx.checkBody('expireTime').value
    });
    debug('set cashback', query);
    try {
      await service.update(query);
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  try {
    ret = await service.query(query, 'cashback');
    data = _.get(ret, 'list.[0]');
    debug('query.cashback.data', data);
  } catch (error) {
    debug('query.cashback.error', error);
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    data,
    query
  });

  await next();
};
