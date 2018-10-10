
'use strict';

/**
 * charge
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;

module.exports = {
  query(values, action = 'defalut') {
    let map = {
      'defalut': '/recharge/rechargeInfoList',
      'excel': '/recharge/exportRechargeInfoList'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error('ERROR_ACTION_URL');
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  count(values, action = 'defalut') {
    let map = {
      'defalut': '/recharge/getReachargeCountData'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error('ERROR_ACTION_URL');
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  update(values, action) {
    let map = {
      'charge_sync': '/recharge/stateSync'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error('ERROR_ACTION_URL');
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
