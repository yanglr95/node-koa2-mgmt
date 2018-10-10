
'use strict';

/**
 * plan setting
 **/
const qs = require('qs');

const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;

module.exports = {
  update(values) {
    let url = '/financeplan/updateBackgroundParaSave';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },

  query(values) {
    let url = '/financeplan/updateBackgroundParaPageQuery';
    return request(`${url}?${qs.stringify(values)}`, {
      method: 'GET',
      baseUrl: API_BASE
    });
  }
};
