
'use strict';

/**
 * charge
 */
const debug = require('debug')('controller:charge');

const { moment, _ } = require('../util/index.js');

// 充值订单
exports.query = async(ctx, next) => {
  const service = ctx.service.charge;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let batch = ctx.checkBody('batch').value;
  let action = ctx.checkBody('action').value;
  let ids = ctx.checkBody('ids').value;
  let excel = ctx.checkBody('excel').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    status: ctx.checkBody('status').value,
    payType: ctx.checkBody('payType').value,
    beginTime: ctx.checkBody('beginTime').value,
    endTime: ctx.checkBody('endTime').value,
    pageNumber,
    pageSize
  };
  let ret;
  let dataList;
  let totalCount;
  let batchResult;
  let batchList;

  batchList = [{ k: 'charge_sync', v: '同步支付状态' }];

  // check date fileds
  ['beginTime', 'endTime'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  // 导出excel
  if (excel === 'excel') {
    debug('excel:', query);
    try {
      ret = await service.query(query, 'excel');
      // 导出excel，跳转
      if (ret.fileUrl && ret.fileUrl.length) {
        ctx.redirect(ret.fileUrl);
        return;
      }
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  // 批量操作
  if (action == 'batch' &&
    batchList && batchList.length &&
    batch && batch.length &&
    _.find(batchList, { k: batch })) {
    if (_.isArray(ids)) {
      ids = ids.join(',');
    }
    debug('batch.update', ids, batch);
    try {
      // TODO: 批量操作成功提示
      batchResult = await service.update({
        staffId,
        staffName,
        ipAddress,
        orderIds: ids
      }, batch);
      debug('batchResult', batchResult);
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  debug('query:', query);
  try {
    ret = await service.query(query, 'defalut');
    // debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    batch,
    batchResult,
    batchList,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 充值记录统计
exports.count = async(ctx, next) => {
  const service = ctx.service.charge;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let batch = ctx.checkBody('batch').value;
  let action = ctx.checkBody('action').value;
  let ids = ctx.checkBody('ids').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    beginDate: ctx.checkBody('beginDate').value,
    endDate: ctx.checkBody('endDate').value
  };
  let ret;
  let dataList;
  let batchList;
  let totalCount;

  // check date fileds
  ['beginDate', 'endDate'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  action = 'defalut';

  debug('query:', action, query);
  try {
    ret = await service.count(query, action);
    // debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    dataList,
    batch,
    action,
    ids,
    batchList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};
