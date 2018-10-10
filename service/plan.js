
'use strict';

/**
 * paln
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

module.exports = {
  create(values) {
    let url = '/financeplan/saveUplan';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  update(values, action) {
    let map = {
      // map
      'setting': '/financeplan/saveUplan',
      // allow access
      'allow': '/financeplan/settingAllowAccess'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  batch(values) {
    let url = '/financeplan/updateAllPlanForSave';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  fetch(values) {
    let url = '/financeplan/detail';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  query(values, action = 'default') {
    let map = {
      'default': '/financeplan/listAll',
      // 获取各项总金额
      'total': '/financeplan/getFinnaceSpCount',
      // 各锁定期的可用金额与用户数
      'account': '/financeplan/getCountByFinanceTotal',
      // 新计划申请退出金额
      'apply': '/financeplan/getFinnaceFundStatistical',
      // 按日期查询退出金额
      'quit': '/financeplan/getQuitTotalByLockPeriod',
      // 加入记录
      'record': '/financeplan/financePlanUserDetail'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  excel(values) {
    // 计划管理导出
    let url = '/financeplan/exportListAll';

    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
