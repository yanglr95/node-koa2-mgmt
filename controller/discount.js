
'use strict';

/**
 * discount
 */
const debug = require('debug')('controller:discount');

const ErrMsg = require('../util/message.js');
const { _ } = require('../util/index.js');

const HTTP_POST = 'POST';
// const HTTP_GET = 'GET';

const NAV_LIST = [{
  key: 'deduction',
  url: '/discount/deduction',
  title: '抵扣券'
},
{
  key: 'coupon',
  url: '/discount/coupon',
  title: '满减券'
}
];

exports.query = async(ctx, next) => {
  const service = ctx.service.discount;

  // let batchList;
  let dataList;
  let totalCount;
  let totalDiscountMoney;
  let ret;
  const DEFAULT_NAV = 'deduction';
  let action = ctx.checkParams('action').value || DEFAULT_NAV;
  let submit = ctx.checkBody('excel').value;

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
    couponType: action === 'deduction' ? 'DISCOUNT' : 'MONEY_OFF',
    minValue4Deductible: ctx.checkBody('minDeduction').value,
    maxValue4Deductible: ctx.checkBody('maxDeduction').value,
    ValueOrRate: ctx.checkBody('interest').value,
    status: ctx.checkBody('status').value,
    issueStrategy: ctx.checkBody('type').value,
    minInvestment: ctx.checkBody('minInvestment').value,
    searchName: ctx.checkBody('searchName').value,
    searchValue: ctx.checkBody('searchVal').value
  };

  // batchList = [{ k: 'declare_sync', v: '作废' }];

  debug('discount.dedection', query, submit);
  if (submit === 'excel') {
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
  try {
    ret = await service.query(query, 'discount_list');
    // debug('discount.list.data:', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
    totalDiscountMoney = ret.data.dicountMoney;
  } catch (error) {
    debug('discount.list.data.error:', error);
    ctx.body = error;
    return;
  };

  Object.assign(ctx.state, {
    stepCurrent: action,
    dataList,
    totalCount,
    pageNumber,
    pageSize,
    stepList: NAV_LIST,
    totalDiscountMoney,
    query
  });
  await next();
};

exports.create = async(ctx, next) => {
  const service = ctx.service.discount;
  const DEFAULT_NAV = 'deduction';
  let allowCategory = [];
  let planIssueCategory;
  let ret;
  let valueData;
  let minInvestData;
  let disRate;
  let valTime;
  let method = ctx.method;
  let action = ctx.checkParams('action').value || DEFAULT_NAV;
  debug('discount.action.nav', action);
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

  Object.assign(ctx.state, {
    stepCurrent: action,
    stepList: NAV_LIST,
    query
  });

  if (HTTP_POST == method) {
    valTime = ctx.checkBody('validity').value;
    valueData = ctx.checkBody('disValue').value;
    disRate = ctx.checkBody('discountRate').value;
    minInvestData = ctx.checkBody('minInvestAmount').value;
    planIssueCategory = ctx.checkBody('planIssueCategory').value;
    query.couponType = action === 'deduction' ? 'DISCOUNT' : 'MONEY_OFF';
    query.batchName = ctx.checkBody('batchName').trim().value;
    query.tag = ctx.checkBody('tag').value;
    query.minInvestAmount = _.isArray(minInvestData) ? minInvestData.join(',') : minInvestData;
    query.maxDiscountAmount = ctx.checkBody('maxDiscountAmount').value;
    query.fixPeriod = ctx.checkBody('fixPeriod').value;
    query.fixPeriodType = ctx.checkBody('fixPeriodType').value;
    query.expireTime = ctx.checkBody('expireTime').value;
    query.discountRate = disRate ? disRate.replace(/，/ig, ',') : disRate;
    query.issueStrategy = ctx.checkBody('issueStrategy').value;
    query.loanIssueCategory = ctx.checkBody('loanIssueCategory').value;
    query.transferIssueCategory = ctx.checkBody('transferIssueCategory').value;
    query.valTime = valTime;
    if (valTime == 'expireTime' && !query.expireTime) {
      ctx.addError('page', ErrMsg.expireTime);
    }
    if (valTime == 'fixPeriod' && !query.fixPeriod) {
      ctx.addError('page', ErrMsg.fixPeriod);
    }
    if (query.loanIssueCategory) {
      allowCategory.push(query.loanIssueCategory);
    }
    if (query.transferIssueCategory) {
      allowCategory.push(query.transferIssueCategory);
    }
    if (planIssueCategory) {
      allowCategory.push(planIssueCategory);
    }
    ctx.state.query = query;
    if (ctx.errors) {
      await next();
      return;
    }
    debug('discount.action.deduction', valTime);

    query.allowBusinessCategory = _.isArray(allowCategory) ? allowCategory.join(',') : allowCategory;

    query.deadLine = planIssueCategory === 'F' ? ctx.checkBody('deadLine').value.replace(/，/ig, ',') : [];
    query.allPlan = ctx.checkBody('allPlan').value ? 1 : 0;
    query.value = _.isArray(valueData) ? valueData.join(',') : valueData;

    debug('discount.action.deduction.query', query);
    try {
      ret = await service.create(query);
      debug('discount.list.data:', ret);
      let _batchId = _.get(ret, 'batchId') || 0;
      if (_batchId) {
        ctx.redirect('/discount/' + _batchId + '/' + action + '/issue');
      } else {
        ctx.redirect('/discount/' + action);
      }
    } catch (error) {
      debug('discount.list.data.error:', error);
      ctx.body = error;
      return;
    };
  }

  await next();
};

exports.detail = async(ctx, next) => {
  const service = ctx.service.discount;

  let dataList;
  let totalCount;
  let discountDetail;
  let ret;
  let batchQuery;
  const DEFAULT_NAV = 'deduction';
  let action = ctx.checkParams('action').value || DEFAULT_NAV;
  let id = ctx.checkParams('id').notEmpty().value;
  let submit = ctx.checkBody('excel').value;

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
    id,
    couponType: action === 'deduction' ? 'DISCOUNT' : 'MONEY_OFF'
  };

  debug('discount.dedection', query, submit);

  if (submit === 'excel') {
    batchQuery = {
      staffId,
      staffName,
      ipAddress,
      id
    };
    debug('excel:', batchQuery);
    try {
      ret = await service.query(batchQuery, 'detailExcel');
      // 导出excel，跳转
      if (ret.fileUrl && ret.fileUrl.length) {
        ctx.redirect(ret.fileUrl);
        return;
      }
    } catch (error) {
      debug('excel.error:', error);
      ctx.body = error;
      return;
    }
  }

  try {
    ret = await service.query(query, 'discount_detail');
    debug('discount.list.data:', ret);
    dataList = ret.list;
    totalCount = ret.rowCount;
    discountDetail = ret.data;
  } catch (error) {
    debug('discount.list.data.error:', error);
    ctx.body = error;
    return;
  };

  Object.assign(ctx.state, {
    stepCurrent: action,
    dataList,
    pageNumber,
    pageSize,
    totalCount,
    stepList: NAV_LIST,
    discountDetail,
    query
  });
  await next();
};

exports.issue = async(ctx, next) => {
  const service = ctx.service.discount;

  const DEFAULT_NAV = 'deduction';
  let ret;
  let issueResult;
  let issueData;
  let action = ctx.checkParams('action').value || DEFAULT_NAV;
  let id = ctx.checkParams('id').notEmpty().value;
  let submit = ctx.checkBody('submit').value;
  let autoType;
  let file;
  let fileUrl;
  let types;

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
    id
  };

  debug('discount.issue:', query, file);

  try {
    ret = await service.query(query, 'issue');
    debug('discount.list.data:', ret);
    issueData = ret;
  } catch (error) {
    debug('discount.list.data.error:', error);
    ctx.body = error;
    return;
  };

  if (HTTP_POST == ctx.method) {
    types = ctx.checkBody('types').value;
    if (submit == 'AUTO') {
      Object.assign(query, {
        autoType: ctx.checkBody('autoType').value,
        batchId: id,
        maxQuantity: ctx.checkBody('maxQuantity').value
      });
    }
    if (submit == 'MANUAL') {
      Object.assign(query, {
        batchId: id,
        userId: ctx.checkBody('issueUserId').value,
        model: ctx.checkBody('issueType').value,
        file: ctx.checkBody('file').value,
        types: _.isArray(types) ? types.join(',') : types
      });
    }
    if (submit == 'SERIAL') {
      Object.assign(query, {
        batchId: id,
        count: ctx.checkBody('count').value,
        types: _.isArray(types) ? types.join(',') : types
      });
    }
    debug('discount.issue.post:', query, submit, autoType);
    try {
      issueResult = await service.issue(query, submit);
      fileUrl = _.get(issueResult, 'fileUrl') || '';
      debug('issue.result', issueResult);
      if (submit == 'SERIAL' && fileUrl) {
        ctx.redirect(fileUrl);
        return;
      }
      ctx.redirect('/discount/' + action);
    } catch (error) {
      debug('discount.issue.error:', error);
      ctx.body = error;
      return;
    }
  }

  Object.assign(ctx.state, {
    stepCurrent: action,
    stepList: NAV_LIST,
    issueData,
    pageNumber,
    pageSize,
    query
  });
  await next();
};

exports.invalid = async(ctx, next) => {
  const service = ctx.service.discount;

  const DEFAULT_NAV = 'deduction';
  let action = ctx.checkParams('action').value || DEFAULT_NAV;
  let id = ctx.checkParams('id').notEmpty().value;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress,
    id
  };

  if (HTTP_POST == ctx.method) {
    debug('forbid', query);
    try {
      await service.invalid(query);
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  Object.assign(ctx.state, {
    stepCurrent: action,
    stepList: NAV_LIST
  });

  await next();
};
