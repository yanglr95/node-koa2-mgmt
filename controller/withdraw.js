
'use strict';

/**
 * withdraw
 */
const debug = require('debug')('controller:withdraw');

const ErrMsg = require('../util/message.js');
const { moment, _, DATE_FORMAT } = require('../util/index.js');

const HTTP_POST = 'POST';
const HTTP_GET = 'GET';

// 充值订单
exports.query = async(ctx, next) => {
  const service = ctx.service.withdraw;

  const NAV_LIST = [
    {
      key: 'new',
      url: '/withdraw?act=new',
      title: '新申请'
    },
    {
      key: 'wait',
      url: '/withdraw?act=wait',
      title: '等待提现'
    },
    {
      key: 'process',
      url: '/withdraw?act=process',
      title: '处理中'
    },
    {
      key: 'refund',
      url: '/withdraw?act=refund',
      title: '退票'
    },
    {
      key: 'done',
      url: '/withdraw?act=done',
      title: '已完成'
    },
    {
      key: 'fail',
      url: '/withdraw?act=fail',
      title: '渠道提现失败'
    },
    {
      key: 'special',
      url: '/withdraw?act=special',
      title: '特殊提现'
    }
  ];
  // actions batch:列表页操作 single:详情页操作
  const ACTIONS = {
    'new': {
      'name': '新申请',
      'single': [
        { k: 'withdraw_reject', v: '驳回' }
      ],
      'batch': [
        { k: 'withdraw_audit', v: '审核通过' }
      ]
    },
    'wait': {
      'name': '等待提现',
      'batch': [
        { k: 'withdraw_batch', v: '批量提现' }
      ]
    },
    'process': {
      'name': '处理中',
      'batch': [
        { k: 'withdraw_sync', v: '更新单据状态' }
      ]
    },
    'refund': {
      'name': '退票',
      'batch': [
        { k: 'withdraw_refund_charge', v: '充值' }
      ]
    },
    'done': {
      'name': '已完成'
    },
    'fail': {
      'name': '渠道提现失败'
    },
    'special': {
      'name': '特殊提现',
      'batch': [
        { k: 'withdraw_special_success', v: '提现成功' },
        { k: 'withdraw_special_fail', v: '提现失败' }
      ]
    }
  };

  const DEFAULT_NAV = 'new';
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
    cashDrawStatus: ctx.checkBody('cashDrawStatus').value,
    drawCashType: ctx.checkBody('drawCashType').value,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    beginTime: ctx.checkBody('beginTime').value,
    endTime: ctx.checkBody('endTime').value
  };

  let ret;
  let dataList;
  let totalCount;
  let batchList;
  let batchResult;
  let lastDate;

  // nav
  if (!(nav in ACTIONS)) {
    nav = DEFAULT_NAV;
  }
  // batch actions
  batchList = ACTIONS[nav]['batch'];

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
    debug('excel:', nav, query);
    try {
      ret = await service.excel(query, nav);
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
    batch && batch.length) {
    // batch should in batchlist
    if (_.find(batchList, { k: batch })) {
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
          cashDrawLogIds: ids
        }, batch);
        debug('batchResult', batchResult);
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  debug('query:', nav, query);
  try {
    ret = await service.query(query, nav);
    // debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
    lastDate = ret.data;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    stepCurrent: nav,
    stepList: NAV_LIST,
    batch,
    batchResult,
    batchList,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    lastDate,
    query
  });
  await next();
};

// 统计
exports.count = async(ctx, next) => {
  const service = ctx.service.withdraw;

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
  let values;
  let dataList;
  let totalCount;
  let entity;

  if (HTTP_GET == ctx.method) {
    query.startDate = moment(now).subtract(1, 'months').format(DATE_FORMAT);
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

  try {
    debug('query', query);
    values = await Promise.all([
      service.count(query, 'fee'),
      service.count(query, 'fund')
    ]);
    entity = _.get(values, '[0]');
    dataList = _.get(values, '[1].list');
    totalCount = _.get(values, '[1].rowCount');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('query.fetch', values);

  Object.assign(ctx.state, {
    entity,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 批次
exports.batch = async(ctx, next) => {
  const service = ctx.service.withdraw;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let nav = ctx.checkQuery('act').value;
  let batch = ctx.checkBody('batch').value;
  let action = ctx.checkBody('action').value;
  let ids = ctx.checkBody('ids').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    cashDrawStatus: ctx.checkBody('cashDrawStatus').value,
    drawCashType: ctx.checkBody('drawCashType').value,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    beginTime: ctx.checkBody('beginTime').value,
    endTime: ctx.checkBody('endTime').value
  };

  let ret;
  let dataList;
  let batchList;
  let totalCount;
  let lastDate;

  // check date fileds
  ['beginTime', 'endTime'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  debug('query:', nav, query);
  try {
    ret = await service.queryBatch(query, nav);
    debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
    lastDate = ret.data;
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
    lastDate,
    query
  });
  await next();
};

// 异步操作
exports.async = async(ctx, next) => {
  const service = ctx.service.withdraw;
  const msg = ErrMsg.def;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const ACTIONS = { 'sync': 'withdraw_refund_sync' };

  const act = ctx.checkBody('act').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress
  };
  let action;

  debug('async.query:', act, query);

  if (!act || !ACTIONS[act]) {
    ctx.addError('page', ErrMsg.def);
  }

  if (ctx.errors) {
    ctx.dumpJSON(400, msg);
    return;
  }
  action = ACTIONS[act];

  debug('async.query:', action, query);
  try {
    // await ctx.service.banner.create();
    await service.update(query, action);
  } catch (error) {
    ctx.dumpJSON(500, error.message || msg);
    return;
  }

  ctx.dumpJSON();
};

// 批次 单个异步操作
exports.batchUpdate = async(ctx, next) => {
  const service = ctx.service.withdraw;
  const msg = ErrMsg.def;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const id = ctx.checkParams('id').notEmpty().value;
  const act = ctx.checkBody('act').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    batchNo: id
  };

  if (ctx.errors) {
    ctx.dumpJSON(400, msg);
    return;
  }
  debug('batchUpdate.query:', act, query);
  try {
    // await ctx.service.banner.create();
    await service.updateBatch(query, act);
  } catch (error) {
    ctx.dumpJSON(500, error.message || msg);
    return;
  }

  ctx.dumpJSON();
};

// 批次详情
exports.batchDetail = async(ctx, next) => {
  const service = ctx.service.withdraw;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ctx.checkParams('id').value || 0;
  let action = ctx.checkBody('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    id,
    batchNo: id
  };
  let ret;
  let entity;
  let dataList;
  let totalCount;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  try {
    ret = await service.fetchBatch(query);
    dataList = _.get(ret, 'list');
    totalCount = _.get(ret, 'rowCount');
    entity = _.get(ret, 'data');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetchBatch:', query, ret);

  Object.assign(ctx.state, {
    entity,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    action,
    query
  });
  await next();
};

// 详情
exports.detail = async(ctx, next) => {
  const service = ctx.service.withdraw;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  // reject:驳回,refund:手动退票，apply:再次申请提现
  const ACTIONS = { 'reject': 'reject', 'refund': 'refund', 'apply': 'apply' };

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkBody('action').value || ctx.checkQuery('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    cashDrawLogId: id
  };

  let ret;
  let tip;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    if (!action || !ACTIONS[action]) {
      ctx.addError('action', '选择要进行的操作');
    }
    if (action && action == 'reject') {
      query.logDesc = ctx.checkBody('logDesc').notEmpty(tip = '请填写驳回原因，1-500字').len(1, 500, tip).value;
    }
    if (action && action == 'refund') {
      query.logDesc = ctx.checkBody('logDesc').notEmpty(tip = '请填写退票原因，1-500字').len(1, 500, tip).value;
    }
    // if (action == 'apply') {
    //   query.bankCode = ctx.checkBody('bankCode').notEmpty(tip = '请选择开户行').value;
    //   query.cardId = ctx.checkBody('cardId').notEmpty(tip = '请输入正确的银行卡号').len(14, 20, tip).value;
    //   // query.deposit = ctx.checkBody('deposit').optional().len(0, 50, tip = '请填写正确的开户行支行').value;
    //   // query.cityNo = ctx.checkBody('cityNo').notEmpty(tip = '请选择开户行所在地').value;
    //   query.repeatCardId = ctx.checkBody('repeatCardId').notEmpty(tip = '请输入正确的重复银行卡号').eq(query.cardId, tip).value;
    // }
    debug('detail.update', query);
    if (action && !ctx.errors) {
      try {
        await service.update(query, action);
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
      pageNumber,
      pageSize,
      cashDrawLogId: id
    });
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

exports.queryWord = async(ctx, next) => {
  const service = ctx.service.withdraw;

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
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value
  };

  let ret;
  let dataList;
  let totalCount;
  let batchList;
  let batchResult;

  // batch actions
  batchList = [{k: 'withdraw_word_delete', v: '删除'}];

  // check date fileds
  ['beginTime', 'endTime'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  // 批量操作
  if (action == 'batch' &&
    batchList && batchList.length &&
    batch && batch.length) {
    // batch should in batchlist
    if (_.find(batchList, { k: batch })) {
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
          blackArray: ids
        }, batch);
        debug('batchResult', batchResult);
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  debug('query:', query);
  try {
    ret = await service.query(query, 'word');
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

exports.updateWord = async(ctx, next) => {
  const service = ctx.service.withdraw;

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
  let tip;

  query.blackType = ctx.checkBody('blackType').notEmpty(tip = '请输入正确类型').trim().value;
  query.blackValue = ctx.checkBody('blackValue').notEmpty(tip = '请输入正确的内容').trim().len(2, 20, tip).value;

  ctx.state.query = query;
  debug(`query:`, query);
  if (ctx.errors) {
    await next();
    return;
  }

  try {
    await service.update(query, 'withdraw_word_add');
    // 保存成功直接跳转列表页
    ctx.redirect('/withdraw/word');
    return;
  } catch (error) {
    ctx.body = error;
  }
};
