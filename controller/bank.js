
'use strict';

/**
 * charge
 */
const HTTP_POST = 'POST';

// bank query
exports.banklist = async(ctx, next) => {
  const service = ctx.service.bank;
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
  let action = 'list';
  try {
    ret = await service.query(query, action);
    ctx.state.dataList = ret;
  } catch (error) {
    ctx.body = error;
    return;
  }
  await next();
};

// bank limit edit
exports.bankLimitEdit = async(ctx, next) => {
  const service = ctx.service.bank;
  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    id: ctx.checkParams('id').isInt().toInt().value
  };
  let ret;
  let action = 'limit';
  let bankInfo;
  let bankId;
  try {
    ret = await service.fetch(query, action);
    bankInfo = ret;
    bankId = ret.id;
  } catch (error) {
    ctx.body = error;
    return;
  }
  Object.assign(ctx.state, {
    bankId,
    bankInfo
  });
  await next();
};

// bank add or update
exports.bankEdit = async(ctx, next) => {
  const service = ctx.service.bank;
  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();
  let id = ~~ctx.checkParams('id').isInt().toInt().value - 0 || 0;
  let query = {
    staffId,
    staffName,
    ipAddress,
    bankName: ctx.checkBody('bankname').notEmpty().value,
    quotaStatus: ctx.checkBody('withholdPay').value,
    bankCode: ctx.checkBody('bankcode').notEmpty().value,
    perDayQuota: ctx.checkBody('day').value,
    perSumQuota: ctx.checkBody('single').value
    // perMonthQuota: ctx.checkBody('month').value
  };
  let action = 'create';
  if (id) {
    query.id = id;
    action = 'edit';
  }
  try {
    await service.update(query, action);
    ctx.state.success = true;
  } catch (error) {
    ctx.body = error;
    return;
  }
  await next();
};

// bank list order
exports.bankListOrder = async(ctx, next) => {
  const service = ctx.service.bank;
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
  let bankId;
  let bankOrder;
  let dataArray = [];
  let i;
  if (ctx.method == HTTP_POST) {
    bankId = ctx.checkBody('bankid').value || 0;
    bankOrder = ctx.checkBody('bankorder').value || 0;
    for (i in bankId) {
      dataArray.push({id: bankId[i] - 0, weight: bankOrder[i] - 0});
    }
    query.data = JSON.stringify(dataArray);
    try {
      await service.update(query, 'order');
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  try {
    ret = await service.query(query, 'order');
    ctx.state.dataList = ret;
  } catch (error) {
    ctx.body = error;
    return;
  }

  await next();
};
