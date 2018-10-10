'use strict';

/**
 * plan
 */
const debug = require('debug')('controller:plan');

const ErrMsg = require('../util/message.js');
const {
  moment,
  _,
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  compoundRate
} = require('../util/index.js');

const HTTP_POST = 'POST';

// 搜索 & 批量操作
exports.query = async(ctx, next) => {
  const service = ctx.service.plan;

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
    lockPeriod: ctx.checkBody('lockPeriod').value,
    financePlanType: ctx.checkBody('financePlanType').value,
    pageNumber,
    pageSize
  };
  let ret;
  let dataList;
  let batchList;
  let totalCount;

  debug('query:', query);
  // 导出excel
  if (excel === 'excel') {
    debug('plan.template.management.excel:', query);
    try {
      ret = await service.excel(query);
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

  try {
    ret = await service.query(query, 'default');
    debug('query.ret', ret);
    if (ret) {
      dataList = ret.list;
      totalCount = ret.rowCount || ret.totalCount || 0;
    }
  } catch (error) {
    ctx.body = error;
    return;
  }

  // 暂时不做批量操作
  batchList = null;

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

// 运行中参数
exports.batch = async(ctx, next) => {
  const service = ctx.service.plan;

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
    lockPeriod: ctx.checkBody('lockPeriod').value
  };
  let tip;
  let ret;
  let dataList;
  let batchList;
  let totalCount;

  if (action == 'batch') {
    // 余额最小投资比例
    query.minInvestRate = ctx
      .checkBody('minInvestRate')
      .trim()
      .len(1, 2, (tip = '余额最小投资比例最多2位整数'))
      .isInt(tip)
      .toInt(tip).value;
    // 最小投资金额
    query.minInvestAmount = ctx
      .checkBody('minInvestAmount')
      .trim()
      .len(1, 20, (tip = '最小投资金额必须100的整数倍'))
      .isInt(tip)
      .isDivisibleBy(100, tip)
      .toInt(tip).value;
    // 单笔投资比例上限
    query.maxInvestRate = ctx
      .checkBody('maxInvestRate')
      .trim()
      .len(1, 2, (tip = '单笔投资比例上限最多2位整数'))
      .isInt(tip)
      .toInt(tip).value;
    // 投标利率限制下限
    query.loanLowestRate = ctx
      .checkBody('loanLowestRate')
      .trim()
      .len(1, 6, (tip = '投标利率限制下限1-6位'))
      .isFloat(tip)
      .toFloat(tip).value;
    // 投标利率限制上限
    query.loanHighestRate = ctx
      .checkBody('loanHighestRate')
      .trim()
      .len(1, 6, (tip = '投标利率上限1-6位，且大于下限'))
      .isFloat(tip)
      .gt(query.loanLowestRate, tip)
      .toFloat(tip).value;
    // 投标期限下限
    query.loanLowestPeriod = ctx
      .checkBody('loanLowestPeriod')
      .trim()
      .len(1, 2, (tip = '投标期限下限最多2位整数'))
      .isInt(tip)
      .toInt(tip).value;
    // 投标期限上限
    query.loanHightestPeriod = ctx
      .checkBody('loanHightestPeriod')
      .trim()
      .len(1, 2, (tip = '投标期限上限最多2位整数,且大于下限'))
      .isInt(tip)
      .gt(query.loanLowestPeriod, tip)
      .toInt(tip).value;

    if (!ctx.errors) {
      try {
        ret = await service.batch(query);
        ctx.state.updateSuccess = true;
        // debug('query.ret', ret);
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }

  debug('query:', query);
  try {
    ret = await service.query({
      staffId,
      staffName,
      ipAddress,
      pageNumber,
      pageSize
    });
    // debug('query.ret', ret);
    dataList = ret.list;
    totalCount = ret.totalCount;
  } catch (error) {
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    dataList,
    action,
    batch,
    batchList,
    ids,
    totalCount,
    pageSize,
    pageNumber,
    query
  });
  await next();
};

// 详情
exports.detail = async(ctx, next) => {
  const service = ctx.service.plan;

  const { staffId, staffName, ipAddress } = ctx.parseParams();

  let id = ctx.checkParams('id').notEmpty().value;
  let method = ctx.method;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id
  };
  let tip;
  let ret;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  if (HTTP_POST == method) {
    // 余额最小投资比例
    query.minInvestRate = ctx
      .checkBody('minInvestRate')
      .trim()
      .len(1, 2, (tip = '余额最小投资比例最多2位整数'))
      .isInt(tip)
      .toInt(tip).value;
    // 最小投资金额
    query.minInvestAmount = ctx
      .checkBody('minInvestAmount')
      .trim()
      .len(1, 20, (tip = '最小投资金额必须100的整数倍'))
      .isInt(tip)
      .isDivisibleBy(100, tip)
      .toInt(tip).value;
    // 单笔投资比例上限
    query.maxInvestRate = ctx
      .checkBody('maxInvestRate')
      .trim()
      .len(1, 2, (tip = '单笔投资比例上限最多2位整数'))
      .isInt(tip)
      .toInt(tip).value;
    // 投标利率限制下限
    query.loanLowestRate = ctx
      .checkBody('loanLowestRate')
      .trim()
      .len(1, 6, (tip = '投标利率限制下限1-6位'))
      .isFloat(tip)
      .toFloat(tip).value;
    // 投标利率限制上限
    query.loanHighestRate = ctx
      .checkBody('loanHighestRate')
      .trim()
      .len(1, 6, (tip = '投标利率上限1-6位，且大于下限'))
      .isFloat(tip)
      .gt(query.loanLowestRate, tip)
      .toFloat(tip).value;
    // 投标期限下限
    query.loanLowestPeriod = ctx
      .checkBody('loanLowestPeriod')
      .trim()
      .len(1, 2, (tip = '投标期限下限最多2位整数'))
      .isInt(tip)
      .toInt(tip).value;
    // 投标期限上限
    query.loanHightestPeriod = ctx
      .checkBody('loanHightestPeriod')
      .trim()
      .len(1, 2, (tip = '投标期限上限最多2位整数,且大于下限'))
      .isInt(tip)
      .gt(query.loanLowestPeriod, tip)
      .toInt(tip).value;

    // 运营文案
    query.tag = ctx
      .checkBody('tag')
      .trim()
      .len(0, 8, '运营文案最多8个字').value;

    if (!ctx.errors) {
      try {
        ret = await service.batch(query);
        ctx.state.updateSuccess = true;
        // debug('query.ret', ret);
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
      financePlanId: id
    });
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('detail.fetch', ret);

  Object.assign(ctx.state, {
    entity: ret
  });
  await next();
};

// 发布
exports.create = async(ctx, next) => {
  const method = ctx.method;
  const service = ctx.service.plan;

  const { staffId, staffName, ipAddress } = ctx.parseParams();

  let action = 'create';

  let tip;
  let query = {
    staffId,
    staffName,
    ipAddress,
    categoryNew: 1,
    contractId: 1,
    novice: 0,
    products:
      '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87'
  };
  // 计划类型
  query.novice = ctx.checkBody('novice').value - 0;
  // 日期类型
  query.dateType = ctx.checkBody('dateType').trim().value;
  // 计划名称
  query.name = ctx
    .checkBody('name')
    .notEmpty((tip = ErrMsg.name))
    .len(2, 20, tip).value;
  // 额度
  query.amount = ctx
    .checkBody('amount')
    .notEmpty((tip = ErrMsg.planAmount))
    .len(3, 20, tip)
    .isInt(tip)
    .isDivisibleBy(100, tip)
    .toInt(tip).value;
  // 立即发布
  query.immediately = ctx.checkBody('immediately').value;
  // 计划发布类型
  query.cashType = ctx.checkBody('cashType').value;
  // 预期收益率（复利）
  query.compoundRate = ctx
    .checkBody('compoundRate')
    .trim()
    .len(1, 6, (tip = '请填写正确的预期收益率（复利）1-6位'))
    .isFloat(tip)
    .toFloat(tip).value;
  // 基准利率（复利）
  query.baseInterestRate = ctx
    .checkBody('baseInterestRate')
    .trim()
    .len(1, 6, (tip = '请填写正确的基准利率（复利）1-6位'))
    .isFloat(tip)
    .toFloat(tip).value;
  // 运营文案
  query.tag = ctx
    .checkBody('tag')
    .trim()
    .len(0, 8, '运营文案最多8个字').value;
  // 预期收益率（单利）
  query.expectedRateUplan = ctx
    .checkBody('expectedRateUplan')
    .trim()
    .len(1, 6, (tip = '请填写正确的预期收益率（单利）'))
    .isFloat(tip)
    .toFloat(tip).value;
  // 可加入额度下限
  query.minRegisterAmount = ctx
    .checkBody('minRegisterAmount')
    .trim()
    .len(3, 20, (tip = ErrMsg.minJoinAmount))
    .isInt(tip)
    .isDivisibleBy(100, tip)
    .le(query.amount, tip)
    .toInt(tip).value;
  // 可加入额度上限
  query.singleMaxRegisterAmount = ctx
    .checkBody('singleMaxRegisterAmount')
    .trim()
    .len(3, 20, (tip = ErrMsg.maxJoinAmount))
    .isInt(tip)
    .isDivisibleBy(100, tip)
    .ge(query.minRegisterAmount, tip)
    .toInt(tip).value;
  // 追加金额倍数
  query.appendMultipleAmount = ctx
    .checkBody('appendMultipleAmount')
    .trim()
    .len(3, 20, (tip = ErrMsg.appendAmount))
    .isInt(tip)
    .isDivisibleBy(100, tip)
    .toInt(tip).value;
  // 申请天数
  query.salePeriod = ctx
    .checkBody('salePeriod')
    .trim()
    .len(1, 6, (tip = '申请天数1到6位整数'))
    .isInt(tip)
    .toInt(tip).value;
  // 产品期限
  query.lockPeriod = ctx
    .checkBody('lockPeriod')
    .trim()
    .len(1, 6, (tip = '产品期限1到6位整数'))
    .isInt(tip)
    .toInt(tip).value;
  // 提前退出费率
  query.quitRateAdvance = ctx
    .checkBody('quitRateAdvance')
    .trim()
    .len(1, 6, (tip = '请填写正确的提前退出费率'))
    .isFloat(tip)
    .toFloat(tip).value;
  // 计划介绍
  query.introduce = ctx
    .checkBody('introduce')
    .trim()
    .len(1, 500, (tip = '计划介绍最多500字')).value;

  // 余额最小投资比例
  query.minInvestRate = ctx
    .checkBody('minInvestRate')
    .trim()
    .len(1, 2, (tip = '余额最小投资比例最多2位整数'))
    .isInt(tip)
    .toInt(tip).value;
  // 最小投资金额
  query.minInvestAmount = ctx
    .checkBody('minInvestAmount')
    .trim()
    .len(1, 20, (tip = '最小投资金额必须100的整数倍'))
    .isInt(tip)
    .isDivisibleBy(100, tip)
    .toInt(tip).value;
  // 单笔投资比例上限
  query.maxInvestRate = ctx
    .checkBody('maxInvestRate')
    .trim()
    .len(1, 2, (tip = '单笔投资比例上限最多2位整数'))
    .isInt(tip)
    .toInt(tip).value;
  // 投标利率限制下限
  query.loanLowestRate = ctx
    .checkBody('loanLowestRate')
    .trim()
    .len(1, 6, (tip = '投标利率限制下限1-6位'))
    .isFloat(tip)
    .toFloat(tip).value;
  // 投标利率限制上限
  query.loanHighestRate = ctx
    .checkBody('loanHighestRate')
    .trim()
    .len(1, 6, (tip = '投标利率上限1-6位，且大于下限'))
    .isFloat(tip)
    .gt(query.loanLowestRate, tip)
    .toFloat(tip).value;
  // 投标期限下限
  query.loanLowestPeriod = ctx
    .checkBody('loanLowestPeriod')
    .trim()
    .len(1, 2, (tip = '投标期限下限最多2位整数'))
    .isInt(tip)
    .toInt(tip).value;
  // 投标期限上限
  query.loanHightestPeriod = ctx
    .checkBody('loanHightestPeriod')
    .trim()
    .len(1, 2, (tip = '投标期限上限最多2位整数,且大于下限'))
    .isInt(tip)
    .gt(query.loanLowestPeriod, tip)
    .toInt(tip).value;
  // 适合人群
  query.riskType = ctx.checkBody('riskType').value;
  // 冷静期期限
  query.coolingOffPeriod = ctx.checkBody('coolingOffPeriod').value;

  if (!query.novice) {
    // 计划加息利率
    query.extraInterestRate = ctx
      .checkBody('extraInterestRate')
      .trim()
      .len(1, 6, (tip = '请填写正确的计划加息利率1-6位'))
      .isFloat(tip)
      .toFloat(tip).value;
  }
  if (query.novice) {
    // 贴息利率
    query.subsidyInterestRate = ctx.checkBody('subsidyInterestRate').value;
  }
  let now = moment().format(DATE_TIME_FORMAT);
  let factor = 1e4;
  let interestTotal = parseInt(query.compoundRate * factor, 10);
  let interestBase = parseInt(query.baseInterestRate * factor, 10);
  let interestExtra = parseInt(query.extraInterestRate * factor, 10);

  // 计划发布
  query.isPlanTime = query.immediately;
  // 计划发布时间
  if (query.immediately) {
    query.planSellingTime = now;
  } else {
    query.planSellingTime = ctx
      .checkBody('planSellingTime')
      .notEmpty(ErrMsg.releaseTime)
      .isDate(ErrMsg.releaseTime)
      .isAfter(now, ErrMsg.afterTime('发布', '当前')).value;
  }
  // 开始加入时间
  query.beginResellingTimeNew = ctx
    .checkBody('beginResellingTimeNew')
    .notEmpty(ErrMsg.joinTime)
    .isDate(ErrMsg.joinTime)
    .isAfter(query.planSellingTime, ErrMsg.afterTime('加入', '发布')).value;
  // 销售结束时间
  query.endSellingTimeStr = ctx
    .checkBody('endSellingTimeStr')
    .notEmpty(ErrMsg.endTime)
    .isDate(ErrMsg.endTime)
    .isAfter(
      query.beginResellingTimeNew,
      ErrMsg.afterTime('结束', '加入')
    ).value;
  // 计划退出时间
  query.quitTime = ctx
    .checkBody('quitTime')
    .notEmpty(ErrMsg.quitTime)
    .isDate(ErrMsg.quitTime)
    .isAfter(query.endSellingTimeStr, ErrMsg.afterTime('退出', '结束')).value;

  let beginTime = moment(query.beginResellingTimeNew).format('X') * 1000;
  let salePeriodTime = query.salePeriod * 24 * 60 * 60 * 1000;
  let endTime = moment(query.endSellingTimeStr).format('X') * 1000;
  let coolingOffPeriodTime = query.coolingOffPeriod * 60 * 1000;

  // 开始加入时间+申请期天数=锁定期开始时间 > 销售期结束时间+冷静期期限
  if (beginTime + salePeriodTime <= endTime + coolingOffPeriodTime) {
    ctx.addError(
      'coolingOffPeriod',
      '开始加入时间+申请期天数=锁定期开始时间 > 销售期结束时间+冷静期期限'
    );
  }

  // 预期收益率 = 基准利率 + 加息利率
  if (!query.novice && interestTotal != interestBase + interestExtra) {
    ctx.addError(
      'extraInterestRate',
      '计划加息利率 = 预期收益率（复利）- 基准利率（复利）'
    );
  }
  // 基准利率（复利） = 预期收益率（复利）
  if (query.novice && query.baseInterestRate != query.compoundRate) {
    ctx.addError('baseInterestRate', '基准利率（复利） = 预期收益率（复利）');
  }
  if (query.novice && query.cashType == 'HXB') {
    ctx.addError('cashType', '新手计划只能选择利息复投');
  }
  // query data for page render
  ctx.state.query = query;
  if (ctx.errors) {
    await next();
    return;
  }

  if (method === HTTP_POST) {
    if (query.id) {
      action = 'update';
    }
    debug(`${action}.query:`, query);

    try {
      await service[action](query);
    } catch (error) {
      ctx.body = error;
      return;
    }

    if (ctx.errors) {
      debug('create.service:', ctx.errors);
      await next();
      return;
    }
    return ctx.redirect('/plan');
  }

  await next();
};

// 修改
exports.update = async(ctx, next) => {
  const service = ctx.service.plan;
  const msg = ErrMsg.def;

  const { staffId, staffName, ipAddress } = ctx.parseParams();

  const ACTIONS = { allow: 'allow', forbid: 'allow' };

  const id = ctx.checkParams('id').notEmpty().value;
  const act = ctx.checkBody('act').notEmpty().value;
  let query = {
    staffId,
    staffName,
    ipAddress,
    id
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

  if (act == 'allow') {
    query.allowAccess = 1;
  }
  if (act == 'forbid') {
    query.allowAccess = 0;
  }

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

// 全局参数
exports.setting = async(ctx, next) => {
  const method = ctx.method;
  const service = ctx.service.planSetting;

  const { staffId, staffName, ipAddress } = ctx.parseParams();

  debug('setting');

  let query;
  let tip;
  let ret;

  if (method === HTTP_POST) {
    query = {
      staffId,
      staffName,
      ipAddress,
      loanOrder: ctx.checkBody('loanOrder').value,
      planOrder: ctx.checkBody('planOrder').value,
      uplanBidOrder: ctx.checkBody('uplanBidOrder').value,
      uplanCreditorOrder: ctx.checkBody('uplanCreditorOrder').value,
      uplanScannigLoan: ctx
        .checkBody('uplanScannigLoan')
        .notEmpty((tip = '请选择是否开启计划定期扫描前台标的'))
        .trim().value,
      financePlanBuyUserLoanTransfer: ctx
        .checkBody('financePlanBuyUserLoanTransfer')
        .notEmpty((tip = '请选择是否开启计划定期扫描散户转让债权'))
        .trim().value,
      loanTransferPresell: ctx
        .checkBody('loanTransferPresell')
        .notEmpty((tip = '请选择是否散户转让债权进入预售状态'))
        .trim().value,
      limitRate: ctx
        .checkBody('limitRate')
        .notEmpty((tip = '请输入正确的散户转让债权-利率限制'))
        .trim()
        .len(1, 4, tip)
        .isFloat(tip)
        .toFloat(tip).value,
      uplanQuitDebtMaxAmount: ctx
        .checkBody('uplanQuitDebtMaxAmount')
        .notEmpty((tip = '请输入正确的计划退出放出到前台债权最大金额'))
        .trim()
        .len(1, 20, tip)
        .isInt(tip)
        .toInt(tip).value,
      uplanQuitDebtMinInterest: ctx
        .checkBody('uplanQuitDebtMinInterest')
        .notEmpty((tip = '输入正确的计划退出放出到前台债权最小利率（含）'))
        .trim()
        .len(1, 4, tip)
        .isFloat(tip)
        .toFloat(tip).value
    };

    if (!query.loanOrder) {
      query.uplanBidOrder = 'LOOP';
    } else {
      query.uplanBidOrder = query.uplanBidOrder.join(',');
    }
    if (!query.planOrder) {
      query.uplanCreditorOrder = 'LOOP';
    } else {
      query.uplanCreditorOrder = query.uplanCreditorOrder.join(',');
    }
    delete query.loanOrder;
    delete query.planOrder;

    if (!ctx.errors) {
      debug('setting.query', query);
      try {
        ret = await service.update(query, 'setting');
        ctx.state.updateSuccess = true;
        // debug('query.ret', ret);
      } catch (error) {
        ctx.body = error;
        return;
      }
    }
  }
  debug('setting');
  try {
    ret = await service.query({
      staffId,
      staffName,
      ipAddress
    });
  } catch (error) {
    ctx.body = error;
    return;
  }
  debug('setting.ret', ret);

  ctx.state.query = ret;

  await next();
};

// 使用模板发布
exports.template = async(ctx, next) => {
  let id = ctx.checkParams('id').notEmpty().value;

  let template = {};
  let query;
  let ret;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }
  try {
    ret = await ctx.service.planTemplate.fetch(id);
  } catch (error) {
    ctx.body = error;
    return;
  }

  debug(ret);

  ctx.assert(ret, 404);

  query = _.clone(ret);
  // 模板计划名称
  query.name = `${ret.name} ${moment().format('YYMMDD')}期`;
  query.novice = query.financePlanType == 'NOVICE' ? 1 : 0;
  // 单利和期限转成数字
  query.expectedRateUplan = Number(query.expectedRateUplan) || 0;
  query.lockPeriod = parseInt(query.lockPeriod, 10) || 0;

  if (query.expectedRateUplan && query.lockPeriod) {
    // 老的计划模板没有 dateType, 所以默认按月算
    if (query.dateType == 'DAY') {
      query.compoundRate = compoundRate(query.expectedRateUplan, 1) + '0';
    } else {
      query.compoundRate =
        compoundRate(query.expectedRateUplan, query.lockPeriod) + '0';
    }
  }
  if (query.id) {
    delete query.id;
  }
  [
    // 提前时间间隔
    'beginDisplayTimeInterval',
    // 计划名称
    'name'
  ].forEach((value, idx) => {
    template[value] = ret[value];
  });
  ctx.state.planTemplate = template;
  ctx.state.query = query;
  await next();
};

exports.count = async(ctx, next) => {
  const service = ctx.service.plan;

  const DEFAULT_NAV = 'total';
  const ACTIONS = {
    total: {
      name: '锁定期总金额统计'
    },
    account: {
      name: '可用金额与用户数统计'
    },
    apply: {
      name: '申请退出金额'
    },
    quit: {
      name: '退出金额统计'
    }
  };
  const {
    pageNumber,
    pageSize,
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let nav = ctx.checkParams('nav').value || DEFAULT_NAV;
  let query = {
    staffId,
    staffName,
    ipAddress,
    pageNumber,
    pageSize,
    section: ctx.checkBody('section').value,
    startTime: ctx.checkBody('startTime').value || moment().format(DATE_FORMAT),
    endTime:
      ctx.checkBody('endTime').value ||
      moment()
        .add(30, 'days')
        .format(DATE_FORMAT)
  };

  let ret;
  let dataList;
  let totalList;
  let totalSum;
  let totalCount;

  // nav
  if (!(nav in ACTIONS)) {
    nav = DEFAULT_NAV;
  }

  // check date fileds
  ['startTime', 'endTime'].forEach(v => {
    let item = query[v];
    let time = moment(item);
    if (!item || !time.isValid()) {
      delete query[v];
    }
  });

  debug('query:', nav, query);
  try {
    ret = await service.query(query, nav);
    debug('query.ret', ret);
    dataList = ret.list;
    totalList = _.get(ret, 'total_period');
    totalSum = _.get(ret, 'total_sum');
    totalCount = ret.rowCount || ret.totalCount || 0;
  } catch (error) {
    debug(error);
    ctx.body = error;
    return;
  }

  Object.assign(ctx.state, {
    navList: ACTIONS,
    nav,
    dataList,
    totalList,
    totalSum,
    pageNumber,
    pageSize,
    totalCount,
    query
  });
  await next();
};

exports.record = async(ctx, next) => {
  const service = ctx.service.plan;

  let ret;
  let dataList;
  let totalCount;

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
    id: ctx.checkParams('id').notEmpty().value
  };

  debug('plan.record.query', query);
  try {
    ret = await service.query(query, 'record');
    debug('query.ret', ret);
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
    totalCount
  });
  await next();
};
