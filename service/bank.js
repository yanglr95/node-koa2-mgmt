
'use strict';

/**
 * charge
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;

module.exports = {
  query(values, action) {
    let map = {
      // 获取银行列表
      'list': '/bank/selectBankQuota',
      // 银行列表排序
      'order': '/bank/bankQuotaListByWeigh'
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
  fetch(values, action) {
    let map = {
      // 编辑银行限额
      'limit': '/bank/selectBankQuotaById'
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
      // 编辑银行限额
      'edit': '/bank/updateBankQuota',
      // 添加银行限额
      'create': '/bank/saveBankQuota',
      // 修改银行排序
      'order': '/bank/updateBankQuotaWeigh'
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
