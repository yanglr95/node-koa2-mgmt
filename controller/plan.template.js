
'use strict';

/**
 * plan template
 */
const debug = require('debug')('controller:plan.template');

const ErrMsg = require('../util/message.js');

const prefix = 'planTemplate';

const HTTP_POST = 'POST';

// 发布 & 修改
exports.createOrUpdate = async(ctx, next) => {
  let query;
  let actionOrId = ctx.checkParams('id').optional().toLowercase().value;
  let action = 'create';
  let method = ctx.method;
  let services = ctx.service[prefix];

  if (method === HTTP_POST) {
    query = {
      novice: ctx.checkBody('novice').value,
      title: ctx.checkBody('title').trim().len(2, 20, ErrMsg.title).value,
      name: ctx.checkBody('name').trim().len(2, 12, ErrMsg.name).value,
      beginDisplayTimeInterval: ctx.checkBody('beginDisplayTimeInterval').trim().len(1, 2, '发布时间提前多久').value,
      contractRsvTemplateId: 1,
      financePlanType: ctx.checkBody('financePlanType').trim().value,
      expectedRateUplan: ctx.checkBody('expectedRateUplan').trim().len(1, 6, '预期收益率').value,
      minRegisterAmount: ctx.checkBody('minRegisterAmount').trim().len(1, 20, '可加入额度下限').value,
      singleMaxRegisterAmount: ctx.checkBody('singleMaxRegisterAmount').trim().len(1, 20, '可加入额度上限').value,
      appendMultipleAmount: ctx.checkBody('appendMultipleAmount').trim().len(1, 6, '追加金额倍数').value,
      salePeriod: ctx.checkBody('salePeriod').trim().len(1, 3, '申请天数').value,
      quitRateAdvance: ctx.checkBody('quitRateAdvance').trim().len(1, 6, '提前退出费率').value,
      introduce: ctx.checkBody('introduce').trim().len(1, 500, '计划介绍最多500字').value,
      minInvestRate: ctx.checkBody('minInvestRate').trim().len(1, 2, '余额最小投资比例').value,
      minInvestAmount: ctx.checkBody('minInvestAmount').trim().len(1, 20, '最小投资金额').value,
      maxInvestRate: ctx.checkBody('maxInvestRate').trim().len(1, 2, '单笔投资比例上限').value,
      loanLowestRate: ctx.checkBody('loanLowestRate').trim().len(1, 6, '投标利率下限').value,
      loanHighestRate: ctx.checkBody('loanHighestRate').trim().len(1, 6, '投标利率上限').value,
      loanLowestPeriod: ctx.checkBody('loanLowestPeriod').trim().len(1, 2, '投标期限下限').value,
      loanHightestPeriod: ctx.checkBody('loanHightestPeriod').trim().len(1, 2, '投标期限上限').value,
      riskType: ctx.checkBody('riskType').value,
      dateType: ctx.checkBody('dateType').value,
      lockPeriod: ctx.checkBody('lockPeriod').trim().len(1, 2, '产品期限').value
    };
    if (query.financePlanType == 'NOVICE') {
      query.subsidyInterestRate = ctx.checkBody('subsidyInterestRate').trim().value;
    }
    if (query.financePlanType == 'NOVICE' && query.dateType == 'DAY' && query.lockPeriod > 30) {
      ctx.addError('lockPeriod', '产品期限单位为天时，不得大于30天');
    }
    // query data for page render
    ctx.state.query = query;
    if (actionOrId && actionOrId !== action) {
      query.id = actionOrId;
      action = 'update';
    }
    if (ctx.errors) {
      debug('createOrUpdate.query:', ctx.errors);
      await next();
      return;
    }

    try {
      await services[action](query);
    } catch (error) {
      ctx.body = error;
      return;
    }

    if (ctx.errors) {
      debug('createOrUpdate.service:', ctx.errors);
      await next();
      return;
    }
    return ctx.redirect('/plan/template');
  }
  await next();
};

// 详情
exports.detail = async(ctx, next) => {
  let id = ctx.checkParams('id').notEmpty().value;
  let query;
  let services = ctx.service[prefix];

  ctx.assert(id, 400);
  if (ctx.errors) {
    ctx.throw(400);
    await next();
    return;
  }

  try {
    query = await services.fetch(id);
  } catch (error) {
    ctx.body = error;
    return;
  }

  ctx.assert(query, 404);
  ctx.state.query = query;
  await next();
};

// 计划模板列表 & 批量操作
exports.query = async(ctx, next) => {
  let services = ctx.service[prefix];
  let ret = await services.fetch();
  ctx.state.dataList = ret;
  debug('query', ret);
  await next();
};
