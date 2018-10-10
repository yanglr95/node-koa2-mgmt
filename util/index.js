'use strict';

/**
 * util
 */
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug');
const config = require('../config.js');

const formula = require('./formula.js');

const DEFAULT_PAGESIZE = 20;

exports._ = exports.lodash = _;
exports.uuid = require('uuid');
exports.moment = moment;
exports.debug = debug;
exports.config = config;

exports.DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
exports.DATE_FORMAT = 'YYYY-MM-DD';
exports.TIME_FORMAT = 'HH:mm:ss';

// 单利计算复利
exports.compoundRate = formula.compoundRate;

// 正则
exports.reMobile = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
exports.safePwd = /^(?![^a-zA-Z]+$)(?!\D+$)/;
// 正则替换
exports.reMobileReplace = /^(\d{3})(.*)(\d{4})$/;
exports.reIdentityReplace = /^(.{2})(.*)(.{2})$/;
exports.reBankCardReplace = /^(.{4})(.*)(.{4})$/;

// pageSize shoulud 20/50/100/500/1000 default 20
exports.checkPageSize = function(pagesize) {
  if (!pagesize) {
    return DEFAULT_PAGESIZE;
  }
  return (
    ~~[20, 50, 100, 500, 1000].find(val => {
      return val == pagesize;
    }) || DEFAULT_PAGESIZE
  );
};

// checkpage
exports.checkPage = function(page) {
  page = ~~page || 1;
  if (page <= 1) {
    page = 1;
  }
  return page;
};

/**
 * 身份证校验
 * @see http://www.cnblogs.com/lzrabbit/archive/2011/10/23/2221643.html
 */
exports.isIdentityCode = function(code) {
  let city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  };
  let tip = '';
  let pass = true;

  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/i.test(
      code
    )
  ) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = '地址编码错误';
    pass = false;
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('');
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      let last = parity[sum % 11];
      if (last.toString() !== code[17].toString().toUpperCase()) {
        tip = '校验位错误';
        pass = false;
        debug('校验位错误', last, code[17]);
      }
    } else {
      pass = false;
    }
  }
  if (!pass) {
    debug('identityCode', tip);
  }
  return pass;
};
