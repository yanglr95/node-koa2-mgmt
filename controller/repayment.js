
'use strict';

/**
 * repayment
 */
const debug = require('debug')('controller:repayment');

// const ErrMsg = require('../util/message.js');
const { moment, _, DATE_FORMAT } = require('../util/index.js');

const HTTP_POST = 'POST';
const HTTP_GET = 'GET';

// 搜索
exports.query = async(ctx, next) => {
  const service = ctx.service.repayment;

  const DEFAULT_NAV = 'new';
  const NAV_LIST = [{
    key: 'new',
    url: '/repayment?act=new',
    title: '还款申请'
  },
  {
    key: 'process',
    url: '/repayment?act=process',
    title: '还款处理'
  }
  ];
  const ACTIONS = {
    'new': {
      'selectType': 1,
      'name': '新申请',
      'batch': [
        { k: 'repayment_approve', v: '提交审批' },
        { k: 'repayment_remove', v: '移除还款信息' },
        { k: 'repayment_refund', v: '正常还款：修改还款类型' },
        { k: 'repayment_refund_early', v: '提前结清：修改还款类型' },
        { k: 'repayment_export', v: '导出还款申请' }
      ]
    },
    'process': {
      'selectType': 2,
      'name': '还款处理',
      'batch': [
        { k: 'repayment_charge', v: '批量充值还款' }
      ]
    }
  };

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let nav = ctx.checkQuery('act').value || DEFAULT_NAV;
  let batch = ctx.checkBody('batch').value;
  let action = ctx.checkBody('action').value;
  let ids = ctx.checkBody('ids').value;
  let excel = ctx.checkBody('excel').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    repayStatus: ctx.checkBody('repayStatus').value,
    repayType: ctx.checkBody('repayType').value,
    searchVal: ctx.checkBody('searchVal').value,
    searchName: ctx.checkBody('searchName').value
  };
  let ret;
  let batchResult;
  let dataList;
  let batchList;
  let totalCount;

  // nav
  if (!(nav in ACTIONS)) {
    nav = DEFAULT_NAV;
  }
  // batch actions
  batchList = ACTIONS[nav]['batch'];
  // selectType: 1 申请查询 2、处理查询
  query.selectType = _.get(ACTIONS[nav], 'selectType');

  // 导出excel
  if (excel === 'excel') {
    debug('excel:', nav, query);
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
    // batch should in batchlist
    _.find(batchList, { k: batch })) {
    if (_.isArray(ids)) {
      ids = ids.join(',');
    }
    debug('batch.update', ids, batch);
    try {
      batchResult = await service.update({
        staffId,
        staffName,
        ipAddress,
        batchIds: ids
      }, batch);
      debug('batchResult', batchResult);
      // 导出excel，跳转
      if (batchResult.fileUrl && batchResult.fileUrl.length) {
        ctx.redirect(batchResult.fileUrl);
      }
    } catch (error) {
      ctx.body = error;
      return;
    }
  }
  debug('query:', query);
  try {
    ret = await service.query(query);
    // debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    stepCurrent: nav,
    stepList: NAV_LIST,
    batch,
    batchResult,
    dataList,
    batchList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 批次
exports.batch = async(ctx, next) => {
  const service = ctx.service.repayment;

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
    pageNumber,
    pageSize,
    auditStatus: ctx.checkBody('auditStatus').value,
    startDate: ctx.checkBody('startDate').value,
    endDate: ctx.checkBody('endDate').value
  };
  let now = new Date();
  let ret;
  let batchResult;
  let dataList;
  let batchList;
  let totalCount;

  if (HTTP_GET == ctx.method) {
    query.startDate = moment(now).subtract(7, 'days').format(DATE_FORMAT);
    query.endDate = moment(now).format(DATE_FORMAT);
  }

  debug('query:', query);
  try {
    ret = await service.query(query, 'batch');
    // debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  // check date fileds
  ['startDate', 'endDate'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  Object.assign(ctx.state, {
    batch,
    action,
    ids,
    batchResult,
    dataList,
    batchList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 批次详情
exports.batchDetail = async(ctx, next) => {
  const service = ctx.service.repayment;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkBody('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    batchId: id
  };

  let ret;
  let tip;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    if (!action) {
      ctx.addError('action', '选择要进行的操作');
    }
    // 取消不需要备注
    if (action != 'cancel') {
      query.remark = ctx.checkBody('remark').notEmpty(tip = '请输入备注，1-500字').len(1, 500, tip).value;
    }
    query.fileUpload = ctx.checkBody('fileUpload').optional().notEmpty(tip = '请选择凭证').len(10, 500, tip).value;
    if (action && !ctx.errors) {
      try {
        await service.updateBatch(query, action);
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  try {
    ret = await service.fetch({
      staffId,
      staffName,
      ipAddress,
      id,
      batchId: id
    }, 'batch');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetchBatch:', query, ret);

  Object.assign(ctx.state, {
    entity: ret,
    action,
    query
  });
  await next();
};

// 批次下载
exports.batchDownload = async(ctx, next) => {
  const service = ctx.service.repayment;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  // let action = ctx.checkBody('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    workFlowId: id
  };

  let ret;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    ret = await service.fetch(query, 'download');
    debug('detail.batchDownload:', query, ret);
    if (!ret.fileUrl || !ret.fileUrl.length) {
      ctx.throw(500);
    }
    ctx.redirect(ret.fileUrl);
  } catch (error) {
    ctx.body = error;
    return;
  }
  ctx.body = true;
  await next();
};

// 历史
exports.history = async(ctx, next) => {
  const service = ctx.service.repayment;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let now = new Date();
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    startDate: ctx.checkBody('startDate').value,
    endDate: ctx.checkBody('endDate').value
  };

  let ret;
  let dataList;
  let totalCount;

  if (HTTP_GET == ctx.method) {
    query.startDate = moment(now).subtract(7, 'days').format(DATE_FORMAT);
    query.endDate = moment(now).format(DATE_FORMAT);
  }

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
    ret = await service.query(query, 'history');
    // debug('query.ret', ret);
    // dataList = _.get(ret, 'list');
    dataList = ret;
    // totalCount = _.get(ret, 'rowCount');
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

// 历史
exports.historyDetail = async(ctx, next) => {
  const service = ctx.service.repayment;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ctx.checkParams('id').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id: id,
    dueDate: id
  };

  let ret;

  debug('query:', query);
  try {
    ret = await service.fetch(query, 'history');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('fetch.detail', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });
  await next();
};

// 历史 下载
exports.historyDownload = async(ctx, next) => {
  const service = ctx.service.repayment;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ctx.checkParams('id').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    repayDate: id
  };

  let ret;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    ret = await service.fetch(query, 'history_download');
    debug('detail.historyDownload:', query, ret);
    if (!ret.fileUrl || !ret.fileUrl.length) {
      ctx.throw(500);
    }
    ctx.redirect(ret.fileUrl);
  } catch (error) {
    ctx.body = error;
  }
};
