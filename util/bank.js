
'use strict';

/**
 * city
 */
const find = require('lodash/find');

const BANK = [
  {id: '0150', name: '农业银行'},
  {id: '0160', name: '工商银行'},
  {id: '0210', name: '中国银行'},
  {id: '0220', name: '建设银行'},
  {id: '0201', name: '交通银行'},
  {id: '5002', name: '光大银行'},
  {id: '5004', name: '民生银行'},
  {id: '5006', name: '招商银行'},
  {id: '5007', name: '兴业银行'},
  {id: '5008', name: '浦发银行'},
  {id: '5005', name: '广发银行'},
  {id: '5009', name: '平安银行'},
  {id: '5012', name: '北京银行'},
  {id: '5000', name: '邮储银行'},
  {id: '5003', name: '华夏银行'},
  {id: '5010', name: '恒丰银行'}
];

exports.BANK = BANK;

exports.parseBank = function(id) {
  return id && find(BANK, { id: id });
};
