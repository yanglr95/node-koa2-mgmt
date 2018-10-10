
'use strict';

/**
 * helper
 */
const moment = require('moment');
const accounting = require('accounting');

const util = require('./index.js');
const enums = require('./enum.js');
const city = require('./city.js');
const bank = require('./bank.js');
const statics = require('./static.js')(util.config);

// static url
exports.static_url = statics;

// format money
accounting.settings.currency.format = '%v';
exports.accounting = accounting;
exports.toFixed = accounting.toFixed;
exports.formatNumber = accounting.formatNumber;
exports.formatMoney = accounting.formatMoney;

// 省份，城市
exports.province = city.PROVINCE;
exports.parseProvince = city.parseProvince;
// bank
exports.bank = bank.BANK;
exports.parseBank = bank.parseBank;

exports.PRODCUT_DISPLAY_AUDIT = enums.PRODCUT_DISPLAY_AUDIT;
exports.PRODCUT_CASHDRAW_STRATEGY = enums.PRODCUT_CASHDRAW_STRATEGY;
exports.PRODCUT_INSURANCE = enums.PRODCUT_INSURANCE;
exports.LOAN_TYPE = enums.LOAN_TYPE;
exports.PRODCUT_RISK_LEVEL = enums.PRODCUT_RISK_LEVEL;
exports.parseLoanStatus = enums.parseLoanStatus;
exports.parseLoanType = enums.parseLoanType;
exports.parseLoanMarriageStatus = enums.parseLoanMarriageStatus;
exports.parseLoanRepaidType = enums.parseLoanRepaidType;
exports.parseRepayBatchStatus = enums.parseRepayBatchStatus;
exports.parsePlanCashType = enums.parsePlanCashType;
exports.parsePlanQuitWay = enums.parsePlanQuitWay;
exports.parseRepayBatchAuditStatus = enums.parseRepayBatchAuditStatus;
exports.parsePlanStatus = enums.parsePlanStatus;
exports.parsePlanFinancePlanType = enums.parsePlanFinancePlanType;
exports.parseChargeStatus = enums.parseChargeStatus;
exports.parseFundSubType = enums.parseFundSubType;
exports.parseFundDisplayType = enums.parseFundDisplayType;
exports.parseWithdrawStatus = enums.parseWithdrawStatus;
exports.parseWithdrawType = enums.parseWithdrawType;
exports.parseWithdrawChannel = enums.parseWithdrawChannel;
exports.parseTransferStatus = enums.parseTransferStatus;
exports.parseBankStatus = enums.parseBankStatus;
// cut string
exports.cutStr = function(val, len, ellipsis) {
  len = (len - 0) || 10;
  ellipsis = ellipsis || '...';
  if (!val) {
    return '';
  }
  let _len = val.length;
  let max = len + 2;
  if (_len < max) {
    return val;
  }
  return val.slice(0, len) + ellipsis;
};

// format date
exports.moment = moment;

// format date
exports.formatdate = function(format, date) {
  format = format || 'YYYY-MM-DD';
  let time = date || new Date();
  return moment(time).format(format);
};

// safe safeIdentity
exports.safeIdentity = function(val) {
  if (!val || val.length < 18) {
    return '****';
  }
  return val.replace(util.reIdentityReplace, '$1**** **** **** **$3');
};

// safe mobile
exports.safeMobile = function(val) {
  if (!val || val.length < 7) {
    return '****';
  }
  return val.replace(util.reMobileReplace, '$1****$3');
};

// safe bank
exports.safeBank = function(val) {
  if (!val || val.length < 8) {
    return '****';
  }
  return val.replace(util.reBankCardReplace, '$1 **** **** $3');
};

// risk
exports.parseRiskRate = function(val) {
  val = ~~val || 0;
  if (val <= 14) {
    return '保守';
  }
  if (val <= 36) {
    return '稳健';
  }
  // greater than 36
  return '积极对应';
};
