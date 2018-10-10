'use strict';

/**
 * product
 **/
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

module.exports = {
  create(values, action = 'default') {
    let map = {
      'default': '/activity/provide'
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
  }
};
