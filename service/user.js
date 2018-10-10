'use strict';

/**
 * user
 */
const request = require('../util/request.js');
const { config } = require('../util/index.js');

const API_BASE = config.apiBase;
const ERROR_ACTION_URL = 'ERROR_ACTION_URL';

module.exports = {
  update(values, action) {
    let map = {
      // 绑定银行卡
      'bindBankCard': '/account/bindCard',
      // 解绑银行卡
      'unbindBankCard': '/account/unBindCard',
      // 绑定身份证
      'idCard': '/account/bindIdCard',
      // 手机号
      'mobile': '/account/operateMobile',
      // 停用启用
      'forbid': '/account/resetUserStatus',
      // 备注
      'remark': '/account/addUserMemo',
      // 人工充值
      'charge': '/recharge/manualRecharge',
      // 平台账户充值
      'charge/platform': '/escrow/platCharge',
      // 人工提现
      'withdraw': '/cashdraw/manualCashDrawSubmit',
      // 平台特殊账户提现
      'withdraw/platform': '/cashdraw/platformSpecialCashDraw',
      // 计划提前退出
      'planquit': '/financeplan/userFinancePlanQuitSet',
      // invite
      'invite': '/account/updateInvestCode',
      // 存管开户
      'account/open': '/account/createEscrowAccount',
      // 平台转账
      'transfer': '/escrow/platformAccountConverse',
      // 好友绑定用户
      'bind': '/account/bindInviteUser',
      // 解除好友绑定
      'unbind': '/account/unbindInviteUser',
      // 修改封禁详情
      'update': '/blackList/addAntiplugin'
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
  fetch(values, action = 'user') {
    let map = {
      // 用户详情
      'user': '/account/showFrontUser',
      // 人工充值
      'charge': '/recharge/toManualRecharge',
      // 提现
      'withdraw': '/cashdraw/manualCashDraw',
      // 平台特殊账户提现
      'withdraw/platform': '/cashdraw/platformSpecialCashDrawPage',
      // 用户计划信息
      'user/plan': '/financeplan/userFinancePlanQuitSetQuery',
      // 封禁详情
      'forbid': '/blackList/antipluginByUser'
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
  query(values, action = 'user') {
    action = action || 'user';
    let map = {
      // 用户列表
      'user': '/account/listFrontUsers',
      // 银行卡列表
      'bankCard': '/account/getBankList',
      // 借款记录
      'borrow': '/account/listBorrowRecords',
      // lend
      'lend': '/account/statistical',
      // 计划资产
      'plan': '/account/listUserFinancePlanRecords',
      // 标的资产
      'loan': '/account/listLoanRecords',
      // 交易记录
      'trade': '/account/listPointLog',
      // 提现记录
      'withdraw': '/account/getCashDrawLogs',
      // 计划投标记录
      'planRecord': '/account/loanRecordsByUserFinancePlanSubPoint',
      // 优惠券
      'discount': '/coupon/couponByCondition',
      // 好友统计
      'statics': '/account/statistics',
      // 统计列表
      'staticsList': '/account/statisticsDetail',
      // 封禁列表
      'forbid': '/blackList/antipluginList'
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
