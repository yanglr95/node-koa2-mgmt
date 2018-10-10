
'use strict';

const rq = require('request-promise');
const util = require('./index.js');

const {
  config
} = util;

let isConsole = config.console;
/*
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
*/
function checkResponseBody(response) {
  if (!response) {
    throw new Error('RESPONSE_EMPTY');
  }
  const json = JSON.parse(response);

  // api response {"status":0,"message":"success","value":{"list":[]}}
  if (json.status == 0) {
    if (json.value) {
      return json.value;
    }
    if (json.data) {
      return json.data;
    }
    return json.value || json.data;
  }

  throw (json || response);
}

module.exports = async function request(url, options) {
  let response;
  // default timeout 10s
  if (options && !options.hasOwnProperty('timeout')) {
    options.timeout = 1e4;
  }

  if (isConsole) {
    console.log('[Request url]', url);
  }

  try {
    response = await rq(url, options);
  } catch (error) {
    throw error.error || error.response || error;
  }
  return checkResponseBody(response);
};
