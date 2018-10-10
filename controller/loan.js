
'use strict';

/**
 * loan
 */
const debug = require('debug')('controller:loan');

const { parseLoanStatus } = require('../util/enum.js');
const { moment, _ } = require('../util/index.js');

const NAV_LIST = [{
  key: 'new',
  url: '/loan?act=new',
  icon: 'plane',
  title: '新申请',
  sub: '新申请的标'
},
{
  key: 'wait',
  url: '/loan?act=wait',
  icon: 'hourglass start',
  title: '等待招标'
},
{
  key: 'bidding',
  url: '/loan?act=bidding',
  icon: 'shipping',
  title: '招标中'
},
{
  key: 'full',
  url: '/loan?act=full',
  icon: 'rocket',
  title: '满标'
},
{
  key: 'repayment',
  url: '/loan?act=repayment',
  icon: 'payment',
  title: '还款中'
},
{
  key: 'done',
  url: '/loan?act=done',
  icon: 'diamond',
  title: '结清'
}
];

// actions batch:列表页操作 single:详情页操作
const ACTIONS = {
  'new': {
    'name': '新申请',
    'single': [
      { k: 'loan_fail', v: '流标' }
    ]
  },
  'wait': {
    'name': '等待招标',
    'batch': [
      { k: 'loan_presell', v: '预售' },
      { k: 'loan_bidding', v: '招标' }
    ],
    'single': [
      { k: 'loan_presell', v: '预售' },
      { k: 'loan_bidding', v: '招标' },
      { k: 'loan_fail', v: '流标' }
    ]
  },
  'bidding': {
    'name': '招标中',
    'batch': [
      { k: 'loan_forbid', v: '交易禁访' },
      { k: 'loan_presell_to_bidding', v: '预售进招标中' }
    ],
    'single': [{ k: 'loan_fail', v: '流标' }]
  },
  'full': {
    'name': '满标',
    'batch': [
      { k: 'loan_pay', v: '放款' },
      { k: 'loan_forbid', v: '交易禁访' }
    ],
    'single': [
      { k: 'loan_fail', v: '流标' }
    ]
  },
  'repayment': {
    'name': '还款中',
    'batch': [
      { k: 'loan_refund', v: '正常还款：加入还款平台' },
      { k: 'loan_refund_early', v: '提前结清：加入还款平台' },
      { k: 'loan_repayment_excel', v: '批量下载协议' }
    ]
  },
  'done': {
    'name': '结清',
    'batch': [
      { k: 'loan_done_excel', v: '批量下载协议' },
      { k: 'loan_done_clearing', v: '下载结清证明' }
    ]
  }
};

const DEFAULT_NAV = 'new';
const HTTP_POST = 'POST';

// 0 OPEN 招标中;1 READY 已满标;2 FAILED 已流标;3 IN_PROGRESS 还款中;4 OVER_DUE 逾期;5 BAD_DEBT 坏账;6 CLOSED 已结标;7 FIRST_APPLY 首次申请;8 FIRST_READY 首次满标;9 PRE_SALES 预售;10 WAIT_OPEN 等待招标;11 FANGBIAO_PROCESSING 放款中;12 LIUBIAO_PROCESSING 流标中',
const STATUS_NAV = {
  'FIRST_APPLY': 'new',
  'WAIT_OPEN': 'wait',
  'OPEN': 'bidding',
  'PRE_SALES': 'bidding',
  'READY': 'full',
  'FIRST_READY': 'full',
  'IN_PROGRESS': 'repayment',
  'CLOSED': 'done'
};

// 标的详情
exports.detail = async(ctx, next) => {
  const service = ctx.service.loan;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ctx.checkParams('id').notEmpty().value;
  let action = ctx.checkBody('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    loanId: id
  };

  let nav;
  let ret;
  let status;
  let batchList;
  let success;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  if (HTTP_POST == ctx.method) {
    if (action) {
      try {
        await service.update({
          staffId,
          staffName,
          ipAddress,
          loanIds: id
        }, action);
        success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    } else {
      ctx.addError('action', '请选择要进行的操作');
    }
  }

  try {
    ret = await service.fetch(query);
    status = (ret && ret.status && parseLoanStatus(ret.status)) || null;
    nav = status && STATUS_NAV[status.code];
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  if (nav) {
    // batch actions
    batchList = ACTIONS[nav]['single'];
  }

  Object.assign(ctx.state, {
    stepCurrent: nav,
    stepList: NAV_LIST,
    batchList,
    success,
    entity: ret
  });
  await next();
};

// 标的搜索 & 批量操作
exports.query = async(ctx, next) => {
  const service = ctx.service.loan;

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
  let recoreId = ctx.checkBody('stoploan').value - 0;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    recoreId,
    minInterest: ctx.checkBody('minInterest').value,
    maxInterest: ctx.checkBody('maxInterest').value,
    minMonths: ctx.checkBody('minMonths').value,
    maxMonths: ctx.checkBody('maxMonths').value,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    startTime: ctx.checkBody('startTime').value,
    endTime: ctx.checkBody('endTime').value,
    passTimeStart: ctx.checkBody('passTimeStart').value,
    passTimeEnd: ctx.checkBody('passTimeEnd').value,
    closeStartTime: ctx.checkBody('closeStartTime').value,
    closeEndTime: ctx.checkBody('closeEndTime').value,
    repayStatus: ctx.checkBody('repayStatus').value,
    beginPassTime: ctx.checkBody('beginPassTime').value,
    endPassTime: ctx.checkBody('endPassTime').value
  };
  let ret;
  let batchResult;
  let batchList;
  let dataList;
  let totalCount;

  // nav
  if (!(nav in ACTIONS)) {
    nav = DEFAULT_NAV;
  }
  // batch actions
  batchList = ACTIONS[nav]['batch'];

  // check date fileds
  ['startTime', 'endTime', 'closeStartTime', 'closeEndTime'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });
  // 导出excel
  if (excel === 'excel') {
    debug('loan.repayment.excel:', query, nav);
    try {
      ret = await service.excel(query, nav);
      debug('loan.repayment.excel:', ret);
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
  if (recoreId) {
    try {
      await service.query(query, 'stoploan');
      ctx.state.stopLoanResult = {'status': 0};
    } catch (error) {
      ctx.state.stopLoanResult = error;
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
          loanIds: ids
        }, batch);
        debug('batchResult', batchResult);
        // 批量导出协议，跳转
        if (batchResult.fileUrl && batchResult.fileUrl.length) {
          ctx.redirect(batchResult.fileUrl);
          return;
        }
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  debug('query:', nav, query);
  try {
    ret = await service.query(query, nav);
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
    batchList,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// lender
exports.lender = async(ctx, next) => {
  const service = ctx.service.loan;

  const {
    // pageNumber,
    // pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const pageNumber = 1;
  const pageSize = 9999;

  let id = ctx.checkParams('id').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    loanId: id
  };
  let dataList;
  let ret;
  let totalCount;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    ret = await service.query(query, 'lender');
    dataList = ret.list;
    totalCount = ret.rowCount || ret.totalCount || 0;
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

exports.contract = async(ctx, next) => {
  const service = ctx.service.loan;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    onlyView: true,
    loanIds: id
  };

  let ret;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  debug('contract.query', query);
  try {
    ret = await service.fetch(query, 'contract');
    debug('contract.fetch', ret);
    // 导出，跳转
    if (ret.fileUrl && ret.fileUrl.length) {
      ctx.redirect(ret.fileUrl);
      return;
    }
  } catch (error) {
    ctx.body = error;
  }
};

// 债权转让列表
exports.transferQuery = async(ctx, next) => {
  const service = ctx.service.loan;

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
    minInterest: ctx.checkBody('minInterest').value,
    maxInterest: ctx.checkBody('maxInterest').value,
    minMonth: ctx.checkBody('minMonth').value,
    maxMonth: ctx.checkBody('maxMonth').value,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    minTime: ctx.checkBody('minTime').value,
    maxTime: ctx.checkBody('maxTime').value,
    status: ctx.checkBody('status').value
  };
  let ret;
  let batchResult;
  let batchList;
  let dataList;
  let totalCount;

  // check date fileds
  ['minTime', 'maxTime'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  debug('query:', query);
  try {
    ret = await service.query(query, 'transfer');
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    batch,
    action,
    ids,
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

// 债权转让详情
exports.transferDetail = async(ctx, next) => {
  const service = ctx.service.loan;

  const {
    pageNumber,
    pageSize,
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
    loanTransferId: id
  };

  let ret;
  let values;
  let dataList;
  let totalCount;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    values = await Promise.all([
      service.fetch(query, 'transfer'),
      service.query(Object.assign({ pageNumber, pageSize }, query), 'transfer/record')
    ]);
    ret = _.get(values, '[0]');
    dataList = _.get(values, '[1].list');
    totalCount = _.get(values, '[1].rowCount');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', values);

  Object.assign(ctx.state, {
    entity: ret,
    action,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 合同模板
exports.setting = async(ctx, next) => {
  await next();
};
