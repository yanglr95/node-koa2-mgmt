'use strict';

/**
 * staff
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;

module.exports = {
  fetch(values) {
    return request('/login', {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  query(values) {
    const url = '/valid/getCodeByPhone';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
