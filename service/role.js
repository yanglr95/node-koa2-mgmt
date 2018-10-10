'use strict';

/**
 * product
 **/
const qs = require('qs');

const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

module.exports = {
  update(values, action = 'default') {
    let map = {
      'default': '/roles/updatePermissions'
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
  query(values, action = 'default') {
    let map = {
      'default': '/roles/getAllPermissions'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    if (action == 'default') {
      return request(`${url}?${qs.stringify(values)}`, {
        method: 'GET',
        baseUrl: API_BASE
      });
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
