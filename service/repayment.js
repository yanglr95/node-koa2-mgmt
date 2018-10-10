'use strict';

/**
 * repayment
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;

const UPDATE_URL = {
  // 提交审批
  'repayment_approve': '/repay/addBatchByIds',
  // 移除还款信息
  'repayment_remove': '/repay/removeBatchRepayListByIds',
  // 正常还款：修改还款类型
  'repayment_refund': '/repay/changeRepayTypeByIds',
  // 提前结清：修改还款类型'
  'repayment_refund_early': '/repay/changeRepayTypeByIds',
  // 批量充值还款
  'repayment_charge': '/repay/batchRepay',
  // 导出excel
  'repayment_export': '/repay/exportRepayApplyList'
};
const BATCH_UPDATE_URL = {
  // 撤销审批
  'cancel': '/repay/cancel',
  // 审批通过
  'pass': '/repay/pass',
  // 审批驳回
  'reject': '/repay/reject'
};
const REPAY_TYPE = {
  'repayment_refund': 'COMMON_REPAY',
  'repayment_refund_early': 'IN_REPAY'
};

module.exports = {
  update(values, action) {
    let url = action && UPDATE_URL[action];
    if (!url) {
      throw new Error('ERROR_ACTION_URL');
    }
    if (REPAY_TYPE[action]) {
      values.repayType = REPAY_TYPE[action];
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  updateBatch(values, action) {
    let url = action && BATCH_UPDATE_URL[action];
    if (!url) {
      throw new Error('ERROR_ACTION_URL');
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  fetch(values, action = 'batch') {
    let map = {
      // 批次
      'batch': '/repay/showDetail',
      // 历史记录
      'history': '/repay/repayStatDetailByDate',
      // 下载
      'download': '/repay/exportRepayDetail',
      //
      'history_download': '/repay/exportRepayHistory'
    };
    let url = action && map[action];
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  query(values, action = 'default') {
    let map = {
      // 还款申请
      'default': '/repay/listForRepay',
      // 批次
      'batch': '/repay/listForAudit',
      // 历史记录
      'history': '/repay/listRepayStat',
      // 还款申请导出excel
      'excel': '/repay/exportRepayApplyList'
    };
    let url = action && map[action];
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  }
};
