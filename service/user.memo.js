'use strict';

/**
 * user memo
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;

module.exports = {
  query(values) {
    let url = '/account/getUserMemos';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
