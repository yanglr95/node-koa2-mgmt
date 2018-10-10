
'use strict';

/**
 * app home
 **/
const debug = require('debug')('controller:app.home');

const { _ } = require('../util/index.js');

const HTTP_POST = 'POST';

exports.home = async(ctx, next) => {
  await next();
};

exports.featured = async(ctx, next) => {
  const service = ctx.service.appFeatured;
  const DEFAULT_ORDER = 99;

  let plan = {
    key: 'plan',
    visible: false,
    recommend: false
  };
  let loan = {
    key: 'loan',
    recommend: false
  };
  let planHxb = {
    key: 'plan_hxb',
    visible: false,
    recommend: false
  };
  let planDict = {};
  let planPerMonth = {};
  let query;
  let ret;

  // default order
  ctx.state.defaultOrder = DEFAULT_ORDER;

  if (HTTP_POST === ctx.method) {
    let months = ctx.checkBody('months').value;
    let order = ctx.checkBody('order').value;
    let visible = ctx.checkBody('visible').value;
    let recommend = ctx.checkBody('recommend').value;
    let perMonths = ctx.checkBody('perMonths').value;
    let perOrder = ctx.checkBody('perOrder').value;
    let perVisible = ctx.checkBody('perVisible').value;
    let perRecommend = ctx.checkBody('perRecommend').value;
    plan.order = ~~ctx.checkBody('planOrder').value || DEFAULT_ORDER;
    planHxb.order = plan.order;
    loan.order = ~~ctx.checkBody('loanOrder').value || DEFAULT_ORDER;
    loan.visible = !!ctx.checkBody('loanVisible').value;
    loan.recommend = !!ctx.checkBody('loanRecommend').value;
    // months
    months && months.forEach((x, idx) => {
      planDict[x] = {
        key: ~~x,
        visible: false,
        recommend: false,
        order: ~~order[idx] || DEFAULT_ORDER
      };
    });
    perMonths && !_.isArray(perMonths) && (perMonths = [perMonths]);
    perOrder && !_.isArray(perOrder) && (perOrder = [perOrder]);
    perMonths && perMonths.forEach((x, idx) => {
      planPerMonth[x] = {
        key: ~~x,
        visible: false,
        recommend: false,
        order: ~~perOrder[idx] || DEFAULT_ORDER
      };
    });
    // convert `visible` to Array
    visible && !_.isArray(visible) && (visible = [visible]);
    visible && visible.forEach(x => {
      if (planDict[x]) {
        plan.visible = true;
        planDict[x].visible = true;
      }
    });
    recommend && !_.isArray(recommend) && (recommend = [recommend]);
    recommend && recommend.forEach(x => {
      if (planDict[x]) {
        plan.recommend = true;
        planDict[x].recommend = true;
      }
    });
    perVisible && !_.isArray(perVisible) && (perVisible = [perVisible]);
    perVisible && perVisible.forEach(x => {
      if (planPerMonth[x]) {
        planHxb.visible = true;
        planPerMonth[x].visible = true;
      }
    });
    perRecommend && !_.isArray(perRecommend) && (perRecommend = [perRecommend]);
    perRecommend && perRecommend.forEach(x => {
      if (planPerMonth[x]) {
        planHxb.recommend = true;
        planPerMonth[x].recommend = true;
      }
    });
    // planChildren
    plan.children = _.orderBy(
      _.map(planDict, val => val), ['visible', 'recommend', 'order', 'key'], ['desc', 'asc', 'asc']
    );
    planHxb.children = _.orderBy(
      _.map(planPerMonth, val => val), ['visible', 'recommend', 'order', 'key'], ['desc', 'asc', 'asc']
    );
    query = _.orderBy(
      [plan, planHxb, loan], ['visible', 'recommend', 'order'], ['desc', 'asc']
    );
    debug('query:', JSON.stringify(query));
    try {
      await service.update(query, 'featured');
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
  } else {
    try {
      ret = await service.fetch('featured');
      debug('featured,fetch', ret);
      query = ret;
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  // data to query
  ctx.state.query = query && _.reduce(query, (result, value, key) => {
    // children Array to Dict
    value.children && value.children.length && (value.children = _.reduce(value.children, (r, v, k) => {
      r[v['key']] = v;
      return r;
    }, {}));
    result[value['key']] = value;
    return result;
  }, {});

  await next();
};
