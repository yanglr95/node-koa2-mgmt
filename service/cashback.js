
'use strict';

/**
 * cashback
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

// const QUERY_URL = {

// };

// exports
module.exports = {
  query(values, action) {
    let map = {
      'cashback': '/cashbackrate/cashBackRateList',
      'log': '/cashbackrate/cashBackRateRecordList',
      'record': '/account/cashbackRecord'
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
  update(values) {
    const url = '/cashbackrate/updateCashBackRate';
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
