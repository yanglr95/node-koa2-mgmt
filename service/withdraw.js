'use strict';

/**
 * withdraw
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

module.exports = {
  excel(values, action) {
    let map = {
      // 退票
      'refund': '/cashdraw/exportCashLogForRefundList',
      // 已完成
      'done': '/cashdraw/exportCashLogForFinishList',
      // 渠道失败
      'fail': '/cashdraw/exportCashLogForFailList'
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
  query(values, action) {
    let map = {
      // 新申请
      'new': '/cashdraw/getApplyCashLog',
      // 等待提现
      'wait': '/cashdraw/getCashDrawListForWait',
      // 处理中
      'process': '/cashdraw/cashLogForInProcessList',
      // 退票
      'refund': '/cashdraw/cashLogForRefundList',
      // 已完成
      'done': '/cashdraw/cashLogForFinishList',
      // 渠道失败
      'fail': '/cashdraw/cashLogForFailList',
      // 特殊提现
      'special': '/cashdraw/cashLogForSpecialList',
      // 获取黑名单
      'word': '/cashdraw/getBlackList'
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
  update(values, action) {
    let map = {
      // 审核通过
      'withdraw_audit': '/cashdraw/auditCashLogForApply',
      // 批量提现
      'withdraw_batch': '/cashdraw/doBatchCashdrawForWait',
      // 更新单据状态
      'withdraw_sync': '/cashdraw/updateDepositStatus',
      // 充值
      'withdraw_refund_charge': '/cashdraw/rechargeLocal',
      // 更新退票单据
      'withdraw_refund_sync': '/cashdraw/updateCashFailedStatus',
      // 特殊渠道提现成功
      'withdraw_special_success': '/cashdraw/cashLogForSpecialStatus',
      // 特殊渠道提现失败
      'withdraw_special_fail': '/cashdraw/cashLogForSpecialStatus',
      // 新申请驳回
      'reject': '/cashdraw/rejectCashLogForApply',
      // 再次申请提现
      'apply': '/cashdraw/secondCashDraw',
      // 恒丰提现手动退票
      'refund': '/cashdraw/updateCashRefundStatus',
      // 增加黑名单
      'withdraw_word_add': '/cashdraw/addBlackList',
      // 删除黑名单
      'withdraw_word_delete': '/cashdraw/deleteBlackList'
    };
    let url = action && map[action];
    if (!url) {
      throw new Error(ERROR_ACTION_URL);
    }
    // 特殊提现失败 cashDrawStatus
    if (action == 'withdraw_special_success') {
      values.cashDrawStatus = 'CASHDRAW_SUCCESS';
    } else if (action == 'withdraw_special_fail') {
      values.cashDrawStatus = 'CASHDRAW_FAILED';
    }
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  updateBatch(values, action) {
    let map = {
      // 更新批次及明细状态
      'update': '/cashdraw/statusQuery',
      // 更新退票单据
      'refund': '/cashdraw/refund',
      // 退回
      'remove': '/cashdraw/returnCashDrawBatchManual'
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
  queryBatch(values) {
    let url = '/cashdraw/cashDrawBatchList';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  fetchBatch(values) {
    let url = '/cashdraw/cashDrawBatchDetail';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  fetch(values) {
    let url = '/cashdraw/getCashDrawLogDetails';
    return request(url, {
      method: 'POST',
      form: values,
      baseUrl: API_BASE
    });
  },
  count(values, action) {
    action = action || 'fund';
    let map = {
      'fund': '/cashdraw/queryCashDrawFundStat',
      'fee': '/cashdraw/queryFee'
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
