'use strict';

/**
 * feedback
 */
const debug = require('debug')('controller:charge');

const { moment } = require('../util/index.js');

// 列表
exports.query = async(ctx, next) => {
  const service = ctx.service.feedback;

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
    startDate: ctx.checkBody('startDate').value,
    endDate: ctx.checkBody('endDate').value,
    pageNumber,
    pageSize
  };
  let ret;
  let dataList;
  let totalCount;

  // check date fileds
  ['startDate', 'endDate'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  debug('query:', query);
  try {
    ret = await service.query(query);
    debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};
