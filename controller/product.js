
'use strict';

/**
 * product
 */
const debug = require('debug')('controller:product');

// const ErrMsg = require('../util/message.js');
const { _ } = require('../util/index.js');

// 列表
exports.query = async(ctx, next) => {
  const service = ctx.service.product;

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
  debug('product.query:::', query);
  try {
    ret = await service.query(query);
    debug(ret);
    dataList = ret.list;
  } catch (error) {
    debug('product.query.error:::', error);
    ctx.body = error;
    return;
  }
  Object.assign(ctx.state, {
    dataList,
    query
  });
  await next();
};

// 添加
exports.create = async(ctx, next) => {
  const service = ctx.service.product;

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

  try {
    ret = await service.fetch(query, 'channel');
    debug('create:channel', ret);
    ctx.state.channelList = _.get(ret, 'channels');
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

// 详情
exports.detail = async(ctx, next) => {
  const service = ctx.service.product;

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
    productId: id
  };
  let ret;

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    return;
  }

  try {
    ret = await Promise.all([
      service.fetch(query),
      service.fetch({
        staffId,
        staffName,
        ipAddress
      }, 'channel')
    ]);
    debug('ret', ret);
    ctx.state.query = _.get(ret, '[0]');
    ctx.state.channelList = _.get(ret, '[1].channels');
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

exports.createOrUpdate = async(ctx, next) => {
  const service = ctx.service.product;
  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();
  let ret;
  let id = ctx.checkParams('id').value;
  let query = {
    staffId,
    staffName,
    ipAddress
  };

  let action = 'create';
  // 借款期限利率
  let monthlyMinInterest = [];
  let monthly = ctx.checkBody('monthly').value;
  let fixInterest = ctx.checkBody('fixInterest').value;
  let settleInterestRate = ctx.checkBody('settleInterestRate').value;
  let inRepayPenalFee = ctx.checkBody('inRepayPenalFee').value;
  let overDueInterestRate = ctx.checkBody('overDueInterestRate').value;
  let overDueMgmtRate = ctx.checkBody('overDueMgmtRate').value;
  let badDebtInterestRate = ctx.checkBody('badDebtInterestRate').value;
  let badDebtMgmtRate = ctx.checkBody('badDebtMgmtRate').value;
  // 提前还款退费
  let inrepayServiceFeeDerate = [];
  let month = ctx.checkBody('month').value;
  let startPeriod = ctx.checkBody('startPeriod').value;
  let endPeriod = ctx.checkBody('endPeriod').value;
  let derate = ctx.checkBody('derate').value;
  // 展现审核项目
  let creditInfoItems = ctx.checkBody('creditInfoItems').value;
  let creditInfoItemsExtra = ctx.checkBody('creditInfoItemsExtra').value;

  let tip;

  // 逾期罚息
  function formatInterest(month, interest, settle, fee, over, overMgmt, bad, badMgmt) {
    return {
      month: month,
      minInterest: interest,
      maxInterest: interest,
      fixInterest: interest,
      hasOverDue: '1', // 逾期费用 1:系统设置 0:接口推送
      inRepayPenalFee: fee,
      overDueInterestRate: over,
      overDueMgmtRate: overMgmt,
      badDebtInterestRate: bad,
      badDebtMgmtRate: badMgmt,
      channelFeeShareRate: '100', // 服务费分成比例
      settleInterestRate: settle
    };
  }
  // 提前还款退费
  function formatInrepay(month, min, max, rate) {
    return {
      month: month,
      startPeriod: min,
      endPeriod: max,
      derate: rate
    };
  }

  try {
    ret = await service.fetch(query, 'channel');
    ctx.state.channelList = _.get(ret, 'channels');
  } catch (error) {
    ctx.body = error;
    return;
  }

  if (id) {
    action = 'update';
    query.productId = id;
  }
  let monthlyMinInterestDict = {};
  if (_.isArray(monthly) &&
    _.isArray(fixInterest) &&
    _.isArray(settleInterestRate) &&
    _.isArray(inRepayPenalFee) &&
    _.isArray(overDueInterestRate) &&
    _.isArray(overDueMgmtRate) &&
    _.isArray(badDebtInterestRate) &&
    _.isArray(badDebtMgmtRate)
  ) {
    monthly.forEach((v, k) => {
      let _month = v;
      let _interest = _.get(fixInterest, `[${k}]`);
      let _settle = _.get(settleInterestRate, `[${k}]`);
      let _fee = _.get(inRepayPenalFee, `[${k}]`);
      let _overRate = _.get(overDueInterestRate, `[${k}]`);
      let _overMgmtRate = _.get(overDueMgmtRate, `[${k}]`);
      let _badDebtRate = _.get(badDebtInterestRate, `[${k}]`);
      let _badMgmtRate = _.get(badDebtMgmtRate, `[${k}]`);
      if (!monthlyMinInterestDict[_month]) {
        monthlyMinInterest.push(
          formatInterest(
            _month, _interest, _settle, _fee,
            _overRate, _overMgmtRate, _badDebtRate, _badMgmtRate)
        );
      }
      monthlyMinInterestDict[_month] = 1;
    });
  } else {
    monthlyMinInterest.push(
      formatInterest(
        monthly, fixInterest, settleInterestRate, inRepayPenalFee,
        overDueInterestRate, overDueMgmtRate, badDebtInterestRate, badDebtMgmtRate)
    );
  }
  if (_.isArray(month) &&
    _.isArray(startPeriod) &&
    _.isArray(endPeriod) &&
    _.isArray(derate)
  ) {
    month.forEach((v, k) => {
      let _month = v;
      let _start = _.get(startPeriod, `[${k}]`);
      let _end = _.get(endPeriod, `[${k}]`);
      let _rate = _.get(derate, `[${k}]`);
      inrepayServiceFeeDerate.push(
        formatInrepay(_month, _start, _end, _rate)
      );
    });
  } else {
    inrepayServiceFeeDerate.push(
      formatInrepay(month, startPeriod, endPeriod, derate)
    );
  }
  // 展现审核项目
  if (!_.isArray(creditInfoItems)) {
    if (creditInfoItems && creditInfoItems.length) {
      creditInfoItems = [creditInfoItems];
    }
  }
  creditInfoItems = creditInfoItems || [];
  // 展现审核项目 自定义文本框
  if (creditInfoItemsExtra && creditInfoItemsExtra.length) {
    creditInfoItems.push(creditInfoItemsExtra);
  }

  debug('逾期罚息', monthlyMinInterest);
  debug('提前还款退费', inrepayServiceFeeDerate);

  query.productName = ctx.checkBody('productName').notEmpty(tip = '请输入正确的产品名称').len(1, 20, tip).trim().value;
  query.creditInfoItems = creditInfoItems.join(',');
  query.monthlyMinInterest = JSON.stringify(monthlyMinInterest);
  query.inrepayServiceFeeDerateJson = JSON.stringify(inrepayServiceFeeDerate);
  [
    'protectType',
    'cashDrawStrategy',
    'loanType',
    'channel',
    'riskLevel',
    'status',
    'contractTemplateId'
  ].forEach(k => {
    query[k] = ctx.checkBody(k).value;
  });

  ctx.state.query = query;
  debug(`query:`, query);
  if (ctx.errors) {
    await next();
    return;
  }

  try {
    await service[action](query);
    // 保存成功直接跳转列表页
    ctx.redirect('/product');
  } catch (error) {
    ctx.body = error;
  }
};
