
'use strict';

/**
 * mock data
 */
const Mock = require('mockjs');
const _ = require('lodash');

const YEAR = 365.25 * 24 * 60 * 60;

if (!global.TABLE_LIST_DATA) {
  const data = Mock.mock({
    'dataList|60-1000': [{
      'name': '@cname',
      'title': '@ctitle(2, 20)',
      'createTime': '@Date(T)',
      'startTime': '@Date(T)',
      'url': '@url("http")',
      'address': '@county(true)',
      'idcard': '@id',
      'province': '@province',
      'city': '@city',
      'region': '@region',
      'mobile|18000000000-18999999999': 1,
      'id|+1': 1,
      'age|11-99': 1,
      'image': unsplash,
      'endTime': dateAfter,
      'avatar': avatar,
      'bank|1': ['中国银行', '工商银行', '建设银行', '农业银行', '交通银行', '招商银行', '民生银行', '光大银行'],
      // loan
      'refID|1-100000': 1,
      'loanId|+1': 1,
      'userId|1-10000': 1,
      'username|': '@cname',
      'amount|5000-1000000': 1,
      'interestRate|5-14.0-2': 1,
      'borrowType': '@ctitle(4,6)',
      'months|1': ['12', '18', '24', '36'],
      'applyTime': '@Date(T)',
      'status|1': [0, 1]
    }],
    page: {
      totalCount: 100,
      currentPage: 1
    }
  });
  global.TABLE_LIST_DATA = data;
}
// avatar
function avatar() {
  let id = _.sample(['christian.jpg', 'elliot.jpg', 'jenny.jpg', 'joe.jpg', 'matt.jpg', 'steve.jpg', 'stevie.jpg']);
  return `/assets/avatar/${id}`;
}
// unsplash
function unsplash() {
  let id = this.id || '';
  return `http://unsplash.it/120/80/?${id}`;
}
// dateAfter
function dateAfter() {
  let start = this.startTime || this.createTime;
  return start - 0 + _.random(1, YEAR) * 1e3;
}
