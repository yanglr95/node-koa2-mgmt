
'use strict';

/**
 * user
 */
const debug = require('debug')('controller:user');

const ErrMsg = require('../util/message.js');
const { moment, _, reMobile } = require('../util/index.js');

const HTTP_POST = 'POST';

// 用户详情
exports.detail = async(ctx, next) => {
  const userService = ctx.service.user;
  const memoService = ctx.service.userMemo;

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
    userId: id
  };

  let ret;
  let values;
  let dataList;
  let totalCount;
  let tip;
  let memoQuery;
  let borrowList;
  let borrowSummary;
  let lendSummary;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (action == 'remark') {
    tip = '备注不能为空，且最多500字';
    query.content = ctx.checkBody('content').trim().len(1, 500, tip).value;
    if (!ctx.errors) {
      try {
        await userService.update(query, 'remark');
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  try {
    memoQuery = Object.assign({
      pageNumber,
      pageSize
    }, query);
    debug('query', query);
    debug('memo.query', memoQuery);
    values = await Promise.all([
      userService.fetch(query),
      memoService.query(memoQuery),
      userService.query(query, 'borrow'),
      userService.query(query, 'lend')
    ]);
    ret = _.get(values, '[0]');
    dataList = _.get(values, '[1].list');
    totalCount = _.get(values, '[1].rowCount');
    borrowSummary = _.get(values, '[2].data');
    borrowList = _.get(values, '[2].list');
    lendSummary = _.get(values, '[3]');
    debug('memo.callback.data+++', ret);
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', values);

  Object.assign(ctx.state, {
    entity: ret,
    lendSummary,
    borrowList,
    borrowSummary,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 列表
exports.query = async(ctx, next) => {
  const service = ctx.service.user;

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
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    userRole: ctx.checkBody('userRole').value,
    startDate: ctx.checkBody('startDate').value,
    endDate: ctx.checkBody('endDate').value,
    pageNumber,
    pageSize
  };
  let ret;
  let dataList;
  let batchList;
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
    ret = await service.query(query, 'user');
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

// 手机号
exports.mobile = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const ACTIONS = {
    'bind': 'BIND',
    'unbind': 'UNBIND',
    'edit': 'EDIT'
  };

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkBody('action').value || ctx.checkQuery('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };

  let ret;
  let tip;

  ctx.state.action = action;
  ctx.state.query = query;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    query.mobile = ctx.checkBody('mobile').notEmpty(tip = '请输入正确的手机号').trim().match(reMobile, tip).value;
    if (!action || !ACTIONS[action]) {
      ctx.addError('page', ErrMsg.def);
    }
    if (ctx.errors) {
      await next();
      return;
    }
    query.action = ACTIONS[action];
    debug('mobile', action, query);
    try {
      await service.update(query, 'mobile');
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
    await next();
    return;
  }

  try {
    ret = await service.fetch(query);
  } catch (error) {
    debug('detail.fetch', error);
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });

  await next();
};

// 功能封禁详情
exports.forbid = async(ctx, next) => {
  const service = ctx.service.user;
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
    userId: id
  };

  let ret;
  let antipluginString = {};

  ctx.state.query = query;
  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (action && action == 'revise') {
    antipluginString.isLogIn = ctx.checkBody('loginSwitch').value;
    antipluginString.quantityLogIn = ctx.checkBody('loginTime').value;
    antipluginString.unitLogIn = ctx.checkBody('loginWhile').value;
    antipluginString.isCheckIn = ctx.checkBody('rechargeSwitch').value;
    antipluginString.quantityCheckIn = ctx.checkBody('rechargeTime').value;
    antipluginString.unitCheckIn = ctx.checkBody('rechargeWhile').value;
    antipluginString.isCashDraw = ctx.checkBody('withdrawSwitch').value;
    antipluginString.quantityCashDraw = ctx.checkBody('withdrawTime').value;
    antipluginString.unitCashDraw = ctx.checkBody('withdrawWhile').value;
    antipluginString.isFinancePlan = ctx.checkBody('planSwitch').value;
    antipluginString.quantityFinancePlan = ctx.checkBody('planTime').value;
    antipluginString.unitFinancePlan = ctx.checkBody('planWhile').value;
    antipluginString.isLoanTransfer = ctx.checkBody('transferSwitch').value;
    antipluginString.quantityLoanTransfer = ctx.checkBody('transferTime').value;
    antipluginString.unitLoanTransfer = ctx.checkBody('transferWhile').value;
    antipluginString.isLoan = ctx.checkBody('loanSwitch').value;
    antipluginString.quantityLoan = ctx.checkBody('loanTime').value;
    antipluginString.unitLoan = ctx.checkBody('loanWhile').value;
    query.antipluginString = JSON.stringify(antipluginString);
    query.creator = query.staffId;
    query.home = ctx.checkBody('content').value || '';
    if (ctx.errors) {
      ctx.redirect('/user/' + id + '/forbid');
      await next();
      return;
    }
    try {
      await service.update(query, 'update');
      ctx.state.success = true;
    } catch (error) {
      debug(`${action}.service.err:`, error);
    }
    await next();
    return;
  }
  try {
    ret = await service.fetch(query, 'forbid');
    debug('user.forbid.detail', ret);
  } catch (error) {
    debug('detail.fetch.error', error);
    ctx.throw(500);
  }

  ctx.state.forbidData = ret;

  await next();
};

// 功能封禁列表
exports.forbidList = async(ctx, next) => {
  const service = ctx.service.user;
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
    userId: ctx.checkBody('searchId').value,
    actionNameCode: ctx.checkBody('searchName').value || 'OR'
  };
  let ret;

  try {
    ret = await service.query(query, 'forbid');
    debug('user.forbid.list:', ret);
  } catch (error) {
    debug('query.service:', error);
  }

  Object.assign(ctx.state, {
    dataList: ret.data,
    pageNumber,
    pageSize,
    totalCount: ret.rowCount
  });
  await next();
};

// 邀请码
exports.invite = async(ctx, next) => {
  const service = ctx.service.user;

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
    userId: id
  };

  let ret;
  let tip;

  ctx.state.action = action;
  ctx.state.query = query;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    query.investCode = ctx.checkBody('investCode').notEmpty(tip = '请输入正确的邀请码').len(1, 200, tip).value;
    debug('invite', action, query);
    try {
      await service.update(query, 'invite');
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
    await next();
    return;
  }

  try {
    ret = await service.fetch(query);
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });

  await next();
};

// 充值
exports.charge = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkQuery('act').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };

  let ret;
  let tip;
  let act = 'charge';

  ctx.state.action = action;
  ctx.state.query = query;

  // 平台账户充值
  if (action == 'platform') {
    act = 'charge/platform';
  }

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    query.amount = ctx.checkBody('amount').notEmpty(ErrMsg.amount).len(1, 20, tip).value;
    query.notes = ctx.checkBody('notes').notEmpty(tip = '请输入备注').len(1, 500, tip).value;
    if (!ctx.errors) {
      debug('charge', query);
      try {
        await service.update(query, act);
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  try {
    ret = await service.fetch(query, 'charge');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });

  await next();
};

// 提现
exports.withdraw = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkQuery('act').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };
  let ret;
  let tip;
  let updateAction = 'withdraw';

  ctx.state.action = action;
  ctx.state.query = query;

  ctx.assert(id > 0, 404);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  // 平台特殊账户提现
  if (action == 'platform') {
    updateAction = 'withdraw/platform';
  }

  if (HTTP_POST == ctx.method) {
    query.amount = ctx.checkBody('amount').notEmpty(tip = '请输入正确的提现金额').len(1, 20, tip).value;
    query.notes = ctx.checkBody('notes').notEmpty(tip = '请输入备注').len(1, 500, tip).value;
    if (action != 'platform') {
      query.advances = ctx.checkBody('advances').value || 0;
      query.isAdvance = query.advances;
    }
    if (!ctx.errors) {
      debug('charge', query);
      try {
        await service.update(query, updateAction);
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  try {
    ret = await service.fetch(query, updateAction);
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });
  await next();
};

// 充值
exports.transfer = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkQuery('act').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };

  let ret;
  let tip;
  let act = 'transfer';

  ctx.state.action = action;
  ctx.state.query = query;

  // 平台账户充值
  if (action == 'platform') {
    act = 'transfer';
  }

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    query.amount = ctx.checkBody('amount').notEmpty(ErrMsg.amount).len(1, 20, tip).value;
    query.notes = ctx.checkBody('notes').notEmpty(tip = '请输入备注').len(1, 500, tip).value;
    query.target = ctx.checkBody('target').notEmpty(tip = '请选择目标账户').value;
    query.sourceAccount = id;
    query.destAccount = query.target;
    if (!ctx.errors) {
      debug('charge', query);
      try {
        await service.update(query, act);
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  try {
    ret = await service.fetch(query, 'charge');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });

  await next();
};

// 身份证
exports.idcard = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const ACTIONS = {
    'bind': 'BIND',
    'unbind': 'UNBIND'
  };

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkBody('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };

  let ret;
  let tip;

  ctx.state.action = action;
  ctx.state.query = query;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    if (action == 'bind') {
      query.idNo = ctx.checkBody('idNo').notEmpty(tip = '请输入正确的身份证').trim().len(18, 18, tip).value;
      query.realName = ctx.checkBody('realName').notEmpty(tip = '请输入正确的真实姓名').trim().len(2, 10, tip).value;
    }
    if (action == 'unbind') {
      query.content = ctx.checkBody('content').notEmpty(tip = '请输入原因，最多500字').trim().len(1, 500, tip).value;
    }
    if (!action || !ACTIONS[action]) {
      ctx.addError('page', ErrMsg.def);
    }
    if (ctx.errors) {
      await next();
      return;
    }
    query.action = ACTIONS[action];
    debug('mobile', action, query);
    try {
      await service.update(query, 'idCard');
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
    await next();
    return;
  }

  try {
    ret = await service.fetch(query);
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    query
  });

  await next();
};

// 存管开户
exports.openAccount = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let action = ctx.checkQuery('act').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };
  let ret;
  let tip;

  ctx.state.query = query;

  ctx.assert(id > 0, 404);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    query.idNo = ctx.checkBody('idNo').notEmpty(tip = '请输入正确的身份证').trim().len(18, 18, tip).value;
    query.name = ctx.checkBody('name').notEmpty(tip = '请输入正确的真实姓名').trim().len(2, 10, tip).value;
    if (!ctx.errors) {
      debug('openAccount', query);
      try {
        await service.update(query, 'account/open');
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  try {
    ret = await service.fetch(query, 'user');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret,
    action,
    query
  });
  await next();
};

// 异步更新
exports.update = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').notEmpty().value || 0;
  let act = ctx.checkBody('act').notEmpty().value;
  let actionId = ctx.checkBody('id').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id,
    userId: id
  };

  if (act == 'unbindBankCard') {
    query.cardId = actionId;
  }

  if (ctx.errors) {
    ctx.dumpJSON(400, ErrMsg.def);
    return;
  }
  debug('batchUpdate.query:', act, query);
  try {
    // await ctx.service.banner.create();
    await service.update(query, act);
  } catch (error) {
    ctx.dumpJSON(500, error.message || ErrMsg.def);
    return;
  }

  ctx.dumpJSON();

  await next();
};

// 银行卡
exports.bankcard = async(ctx, next) => {
  const service = ctx.service.user;

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
    userId: id
  };

  let values;
  let ret;
  let dataList;
  let totalCount;
  let tip;

  ctx.state.action = action;
  ctx.state.query = query;

  ctx.assert(id > 0, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method && action) {
    query.bankNo = ctx.checkBody('bankNo').notEmpty(tip = '请输入正确的银行卡号').len(14, 20, tip).value;
    query.bankCode = ctx.checkBody('bankCode').notEmpty(tip = '请选择开户行').value;
    query.preMobile = ctx.checkBody('preMobile').notEmpty(tip = '请输入正确的预留手机号').match(reMobile, tip).value;
    // query.cityNo = ctx.checkBody('cityNo').notEmpty(tip = '请选择开户行所在地').value;
    // query.deposit = ctx.checkBody('deposit').optional().len(0, 50, tip = '请填写正确的开户行支行').value;
    if (!ctx.errors) {
      try {
        await service.update(query, 'bindBankCard');
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  debug('bankcard.fetch.query', query);
  try {
    values = await Promise.all([
      service.fetch(query, 'user'),
      service.query(query, 'bankCard')
    ]);
    ret = _.get(values, '[0]');
    dataList = _.get(values, '[1].list');
    totalCount = _.get(values, '[1].rowCount');
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('bankcard.fetch', values);

  Object.assign(ctx.state, {
    entity: ret,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 资金
exports.fund = async(ctx, next) => {
  const service = ctx.service.user;

  const ACTIONS = ['trade', 'withdraw'];
  const DEFAULT_NAV = 'trade';

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let nav = ctx.checkQuery('act').value || DEFAULT_NAV;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    nav,
    userId: id
  };
  let ret;
  let dataList;
  let totalCount;

  ctx.assert(id > 0, 404);

  // nav
  if (ACTIONS.indexOf(nav) == -1) {
    nav = DEFAULT_NAV;
  }

  debug('fund.query:', nav, query);
  try {
    ret = await service.query(query, nav);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('fund.fetch:', ret);

  Object.assign(ctx.state, {
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 资产
exports.asset = async(ctx, next) => {
  const service = ctx.service.user;

  const ACTIONS = ['plan', 'loan', 'discount'];
  const DEFAULT_NAV = 'plan';
  // plan status
  const STATUS = {
    // 收益中
    0: 'INPROGRESS',
    // 退出中
    1: 'EXITING',
    // ,已退出
    2: 'EXITED'
  };
  const LIST = {
    0: 'DISCOUNT',
    1: 'MONEY_OFF'
  };

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let nav = ctx.checkQuery('act').value || DEFAULT_NAV;
  let filter = ctx.checkQuery('filter').value || 0;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    nav,
    userId: id
  };
  let ret;
  let dataList;
  let totalCount;

  ctx.assert(id > 0, 404);

  // nav
  if (ACTIONS.indexOf(nav) == -1) {
    nav = DEFAULT_NAV;
  }

  // plan query status
  if ('plan' == nav) {
    query.type = STATUS[filter] || STATUS[filter = 0];
  }

  if ('discount' == nav) {
    query.couponType = LIST[filter] || LIST[filter = 0];
  }

  debug('asset.query:', nav, query);
  try {
    ret = await service.query(query, nav);
    // debug('asset.query:', nav, ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
  } catch (error) {
    debug('asset.query.error', error);
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query,
    filter
  });
  await next();
};

// 计划投标记录
exports.plan = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let planid = ~~ctx.checkParams('planid').value || 0;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    userId: id,
    planId: planid,
    financePlanId: planid
  };
  let ret;
  let dataList;
  let totalCount;

  ctx.assert(id > 0, 404);
  ctx.assert(planid > 0, 404);

  debug('plan.query:', query);
  try {
    ret = await service.query(query, 'planRecord');
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

// 计划提前退出
exports.planQuit = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let id = ~~ctx.checkParams('id').value || 0;
  let planid = ~~ctx.checkParams('planid').value || 0;
  let action = ctx.checkBody('action').value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    userId: id,
    planId: planid,
    financePlanId: planid
  };
  let ret;
  let tip;
  let dataList;
  let totalCount;

  ctx.assert(id > 0, 404);
  ctx.assert(planid > 0, 404);

  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  if (HTTP_POST == ctx.method) {
    query.quitRate = ctx.checkBody('rate').trim()
      .len(1, 6, tip = '请输入正确手续费比例 0.00-100.00')
      .isFloat(tip).toFloat(tip).ge(0, tip).le(100, tip)
      .value;
    query.quitReason = ctx.checkBody('remark').trim()
      .len(0, 500, tip = '备注备注内容').value;
    if (!ctx.errors) {
      debug('mobile', action, query);
      try {
        await service.update(query, 'planquit');
        ctx.state.success = true;
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  debug('planQuit.fetch.query:', query);
  try {
    ret = await service.fetch(query, 'user/plan');
    debug('planQuit.fetch.query:', ret);
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    entity: ret,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

// 好友统计明细
exports.statics = async(ctx, next) => {
  const service = ctx.service.user;

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
    userId: ctx.checkParams('id').value - 0,
    searchName: ctx.checkBody('searchName').value,
    searchVal: ctx.checkBody('searchVal').value,
    level: ctx.checkBody('level').value || 0,
    investStatus: ctx.checkBody('investStatus').value || 0,
    pageNumber,
    pageSize
  };
  // let ret;
  let values;
  let staticsData;
  let totalCount;
  let dataList;

  debug('user.statics.list::', query);

  try {
    values = await Promise.all([
      service.query(query, 'statics'),
      service.query(query, 'staticsList')
    ]);
    debug('query.ret', values);
    staticsData = _.get(values, '[0]');
    dataList = _.get(values, '[1].list');
    totalCount = _.get(values, '[1].rowCount');
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    staticsData,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    query
  });

  await next();
};

exports.bind = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    userId: ctx.checkParams('id').value,
    inviteId: ctx.checkBody('inviteId').value
  };

  debug('user.statics.list::', query);

  if (HTTP_POST == ctx.method) {
    debug('bind', query);
    try {
      await service.update(query, 'bind');
      ctx.state.success = true;
    } catch (error) {
      debug('bind.user.error', error);
      ctx.body = error;
      return;
    }
  }

  Object.assign(ctx.state, {
    query
  });

  await next();
};

exports.unbind = async(ctx, next) => {
  const service = ctx.service.user;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    inviteId: ctx.checkParams('id').value,
    userId: ctx.checkQuery('inviteid').value
  };
  debug('user.statics.list::', query);

  if (HTTP_POST == ctx.method) {
    debug('bind', query);
    try {
      await service.update(query, 'unbind');
      ctx.state.success = true;
    } catch (error) {
      debug('bind.user.error', error);
      ctx.body = error;
      return;
    }
  }

  Object.assign(ctx.state, {
    query
  });

  await next();
};
