
'use strict';

/**
 * loan
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');
const debug = require('debug')('service:loan');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

const QUERY_URL = {
  // 新申请
  'new': '/loan/listFirstApplyForServiceCustomer',
  // 等待招标
  'wait': '/loan/waitOpen',
  // 招标中
  'bidding': '/loan/listOpenLoans',
  // 满标
  'full': '/loan/getListFirstFullLoans',
  // 还款中
  'repayment': '/loan/listInprogress',
  // 结清
  'done': '/loan/finishClear',
  // 标的lender
  'lender': '/loan/findUserInfoOfLoan',
  // 债权转让
  'transfer': '/loanTransfer/searchLoanTransfer',
  // 债权购买记录
  'transfer/record': '/loanTransfer/getTransferBuyList',
  // 终止借款
  'stoploan': '/loan/stopLoan'
};

const UPDATE_URL = {
  // 流标
  'loan_fail': '/loan/failedLoan',
  // 预售
  'loan_presell': '/loan/loanPreSalesFromWaitOpen',
  // 招标
  'loan_bidding': '/loan/loanOpenFromWaitOpen',
  // 预售进招标中
  'loan_presell_to_bidding': '/loan/loanPreToOpen',
  // 交易禁访
  'loan_forbid': '/loan/loanAccessLimit',
  // 放款
  'loan_pay': '/loan/approveloans',
  // 加入还款平台：正常还款
  'loan_refund': '/repay/addRepayListByIds',
  // 加入还款平台：提前结清
  'loan_refund_early': '/repay/addRepayListByIds',
  'loan_repayment_excel': '/loan/downloadReapyContracts',
  'loan_done_excel': '/loan/downloadClearContracts',
  // 下载结清证明
  'loan_done_clearing': '/loan/clearingContract'
};

const FETCH_URL = {
  // 标的
  'loan': '/loan/findSingleLoan',
  // 债权转让 详情
  'transfer': '/loanTransfer/getTransferdetail',
  // 结清协议下载
  'contract': '/loan/downloadClearContracts'
};

// exports
module.exports = {
  create(values) {},
  update(values, action) {
    const _mapRepayType = {
      'loan_refund': 'COMMON_REPAY',
      'loan_refund_early': 'IN_REPAY'
    };
    const url = action && UPDATE_URL[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    if (_mapRepayType[action]) {
      values.recordIds = values.loanIds;
      values.repayType = _mapRepayType[action];
      delete values.loanIds;
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  remove(id) {},
  fetch(values, action = 'loan') {
    const url = action && FETCH_URL[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  query(values, action) {
    const url = action && QUERY_URL[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    return request(url, {
      method: 'POST',
      form: values,
      timeout: 2e4,
      baseUrl: API_BASE
    });
  },
  excel(values, action) {
    const map = {
      // 等待招标
      'wait': '/loan/exportWaitOpenList',
      // 招标中导出
      'bidding': '/loan/exportListOpenLoans',
      // 还款中导出
      'repayment': '/loan/exportListInprogress'
    };
    const url = action && map[action];
    debug('loan.excel.url:', url);
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
