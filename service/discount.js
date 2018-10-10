
'use strict';

/**
 * discount
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

const QUERY_URL = {
  'discount_list': '/coupon/getCouponBatchByCondition',
  'discount_detail': '/coupon/couponByCondition',
  // 批次导出
  'excel': 'coupon/exportCouponBatch',
  // 详情导出
  'detailExcel': '/coupon/exportCoupon',
  // 发放页查询
  'issue': '/coupon/getCouponBatchById'
};

// exports
module.exports = {
  create(values) {
    let _createUrl = '/coupon/addCouponBatch';
    if (!_createUrl) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(_createUrl, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  query(values, action) {
    const url = action && QUERY_URL[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  issue(values, action) {
    let map = {
      'AUTO': '/coupon/autoRelease',
      'MANUAL': '/coupon/releaseCouponByManual',
      'SERIAL': '/coupon/releaseCouponByCode'
    };
    const url = action && map[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  invalid(values) {
    let url = '/coupon/disableCouponBatch';
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
