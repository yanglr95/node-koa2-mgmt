
'use strict';

/**
 * 枚举转换
 */
const find = require('lodash/find');

// 渠道用户
exports.CHANNEL_USER_CODE = {
  'DEBX_ZHIXIN': '红上至信',
  'FROM_WEBSITE': '普通用户'
};
// 产品类型
exports.PRODCUT = {
  'ZHIXIN': '至信'
};
// 产品展现审核项目
exports.PRODCUT_DISPLAY_AUDIT = {
  'IDENTIFICATION_SCANNING': '身份证认证',
  'CREDIT': '个人信用报告',
  'WORK': '工作认证',
  'INCOME_DUTY': '收入认证'
};
// 产品放款方式
exports.PRODCUT_CASHDRAW_STRATEGY = {
  'LENDING_TO_BORROWER': '放款给借款人'
};
// 产品保障方式
exports.PRODCUT_INSURANCE = {
  'ALLPROTECT': '本金+利息',
  'PRINCIPAL': '本金'
};
// 产品风险等级
exports.PRODCUT_RISK_LEVEL = {
  'AA': 'AA',
  'A': 'A',
  'B': 'B',
  'C': 'C',
  'D': 'D',
  'ZX': '由至信推送'
};
// 标的状态
exports.LOAN_STATUS = {
  '0': {'code': 'OPEN', 'name': '招标中'},
  '1': {'code': 'READY', 'name': '已满标'},
  '2': {'code': 'FAILED', 'name': '已流标'},
  '3': {'code': 'IN_PROGRESS', 'name': '还款中'},
  '4': {'code': 'OVER_DUE', 'name': '逾期'},
  '5': {'code': 'BAD_DEBT', 'name': '坏账'},
  '6': {'code': 'CLOSED', 'name': '已结标'},
  '7': {'code': 'FIRST_APPLY', 'name': '首次申请'},
  '8': {'code': 'FIRST_READY', 'name': '首次满标'},
  '9': {'code': 'PRE_SALES', 'name': '预售'},
  '10': {'code': 'WAIT_OPEN', 'name': '等待招标'},
  '11': {'code': 'FANGBIAO_PROCESSING', 'name': '放款中'},
  '12': {'code': 'LIUBIAO_PROCESSING', 'name': '流标中'}
};
// 还款类型
exports.LOAN_TYPE = {
  'DEBX': '等额本息'
  // 'FXHB': '付息还本',
  // 'XXHB': '先息后本'
};
// 婚姻状态
exports.LOAN_MARRIAGE_STATUS = {
  'UNMARRIED': '未婚',
  'MARRIED': '已婚',
  'DIVORCED': '离异',
  'WIDOWED': '丧偶'
};
// 还款方式
exports.LOAN_REPAID_TYPE = {
  'IN_REPAY': '提前还款',
  'COMMON_REPAY': '正常还款',
  'OVER_DUE_REPAY': '逾期还款',
  'END_REPAY': '终止借款'
};
// 投标方式
exports.LOAN_LENDER_TYPE = {
  'NORMAL_BID': '普通投标',
  'FINANCEPLAN_BID': '理财计划投标'
};
// 计划状态
exports.PLAN_STATUS = {
  'DRAFT': '草稿',
  'PURCHASEING': '申请期',
  'PURCHASE_END': '锁定期',
  'PLAN_CLOSED': '已结束',
  'DELETED': '已删除',
  'REDEMPTION_PERIOD': '开放期'
};
// 计划类型
exports.PLAN_FINANCE_PLAN_TYPE = {
  'NOVICE': '新手计划',
  'GENERAL': '常规计划'
};
// 计划子账户状态
exports.PLAN_SUB_ACCOUNT_STATUS = {
  'INPROGRESS': '正常',
  'EXITED': '已退出',
  'EXITING': '退出中'
};
// 计划子账户提现类型
exports.PLAN_CASH_TYPE = {
  'HXB': '按月计息',
  'INVEST': '收益复投'
};
// 计划持有明细 退出方式
exports.PLAN_QUIT_WAY = {
  'QUIT': '可退出',
  'ANNUL_QUIT': '撤销退出',
  'STAY_QUIT': '待退出'
};
// 计划子账户交易记录子类型
exports.PLAN_FUND_SUB_TYPE = {
  'RECHARGE': '追加资金',
  'BID_FREEZE': '投标冻结',
  'BID_CHECKOUT': '投标成功',
  'BID_FAILED': '流标退款',
  'REPAID_PRINCIPAL': '回收本金',
  'REPAID_INTEREST': '回收利息',
  'INREPAY_PRINCIPAL': '提前回收本金',
  'INREPAY_INTEREST': '提前回收利息和罚息',
  'BAD_PRINCIPAL': '垫付本金',
  'BAD_INTEREST': '垫付利息',
  'FAXI_OVERDUE': '逾期罚息',
  'CASH_DRAW_FREEZE': '提现冻结',
  'CASH_DRAW_SUCC': '提现成功',
  'CASH_DRAW_FAILED': '提现失败退款',
  'FEE_CASH_DRAW': '提现手续费',
  'REPAID_INTEREST_FEE': '回收利息手续费',
  'INTEREST_REINVESTED': '收益再投资',
  'SALE_DEBT': '出售债权',
  'BUY_DEBT': '购买债权',
  'PRINCIPAL_COMPENSATION': '理财计划本金补偿',
  'INTEREST_TO_PRINCIPAL': '收益归集至本金',
  'QUIT_FEE': '退出费用',
  'REPAID_INTEREST_FEE_RETURN': '返还回收利息手续费',
  'ACCRUED_INTEREST_FIX_P2I': '平衡应计利息本金转入利息',
  'ACCRUED_INTEREST_FIX_I2P': '平衡应计利息利息转入本金',
  'CONTINGENCIES_FREEZE': '冻结或有费用',
  'CONTINGENCIES_UNFREEZE': '解冻或有费用',
  'UPLAN_QUIT_ADVANCE_FEE_FREEZE': '冻结理财计划提前退出手续费',
  'UPLAN_QUIT_ADVANCE_FEE_UNFREEZE': '解冻理财计划提前退出手续费',
  'UPLAN_SERVICE_FEE_FREEZE': '冻结理财计划服务费',
  'UPLAN_SERVICE_FEE': '扣除理财计划服务费',
  'AUTOINVESTPLAN_INTEREST_FEE': '回收薪计划利息管理费',
  'AUTOINVESTPLAN_APPLY': '加入薪计划',
  'AUTOINVESTPLAN_RECHARGE': '薪计划充值',
  'START_LOAN_TRANSFER_FREEZE': '理财投标转帐到冻结',
  'LOAN_TRANSFER_FREEZE': '购买债权冻结',
  'LOAN_TRANSFER_UNFREEZE': '购买债权解冻',
  'LOAN_TRANSFER_FAIL_UNFREEZE': '存管失败解冻',
  'REPAID_INTEREST_FEE_FREEZE': '回收利息手续费冻结',
  'AUTOINVESTPLAN_INTEREST_FEE_FREEZE': '回收薪计划利息管理费冻结',
  'AUTO_INVEST_PLAN_OVERDUE_FEE_FREEZE': '冻结薪计划逾期管理费',
  'AUTO_INVEST_PLAN_OVERDUE_FEE_UNFREEZE': '解冻薪计划逾期管理费',
  'AUTO_INVEST_PLAN_INTEREST_FEE': '扣除薪计划利息服务费'
};
// 交易记录类型
exports.FUND_TYPE = {};
// 交易记录类型，显示大类
exports.FUND_DISPLAY_TYPE = {
  '0': {'code': 'RECHARGE', 'name': '充值'},
  '1': {'code': 'CASH_DRAW', 'name': '成功提现'},
  '2': {'code': 'CASH_DRAW_FAILED', 'name': '提现失败退款'},
  '3': {'code': 'CHECKIN', 'name': '招标成功'},
  '4': {'code': 'REPAY_OR_INREPAY', 'name': '偿还本息'},
  '5': {'code': 'SALE_DEBT', 'name': '债权转出'},
  '6': {'code': 'BUY_DEBT', 'name': '债权转入'},
  '7': {'code': 'REGISTER_FINANCE_PLAN', 'name': '加入计划'},
  '8': {'code': 'FINANCEPLAN_CASHDRAW', 'name': '计划回款'},
  '9': {'code': 'FINANCEPLAN_QUIT_CASHDRAW', 'name': '计划退出'},
  '10': {'code': 'FINANCE_PLAN_QUIT_ADVANCE_FEE', 'name': '红利计划提前退出费用'},
  '11': {'code': 'PLATFORM_FEE', 'name': '平台服务费'},
  '12': {'code': 'PLATFORM_FEE_REFUND', 'name': '服务费返还'},
  '13': {'code': 'CHECKOUT', 'name': '投标成功'},
  '14': {'code': 'BALANCE_DIFF_TO_BORROWER', 'name': '还款差额补足'},
  '15': {'code': 'TRANSFER_BORROWER_TO_HXB_FOR_BALANCE', 'name': '还款差额收取'},
  '16': {'code': 'FREEZE', 'name': '资金冻结'},
  '17': {'code': 'UNFREEZE', 'name': '资金解冻'},
  '18': {'code': 'COUPON_DISCOUNT_RED_ENVELOPES_PAY', 'name': '抵用金支出'},
  '19': {'code': 'COUPON_MONEY_OFF_RED_ENVELOPES_PAY', 'name': '抵用金支出'},
  '20': {'code': 'COUPON_DISCOUNT', 'name': '优惠券'},
  '21': {'code': 'COUPON_MONEY_OFF', 'name': '优惠券'}
};
// 交易记录子类型
exports.FUND_SUB_TYPE = {
  '0': {'code': 'RECHARGE', 'name': '网关充值'},
  '1': {'code': 'CHECKOUT', 'name': '投标成功'},
  '2': {'code': 'CHECKIN', 'name': '招标成功'},
  '3': {'code': 'REPAY', 'name': '偿还本息'},
  '4': {'code': 'REPAID', 'name': '回收本息'},
  '5': {'code': 'IN_REPAY', 'name': '提前还款'},
  '6': {'code': 'IN_REPAID', 'name': '提前回收'},
  '7': {'code': 'CASH_DRAW', 'name': '用户提现'},
  '8': {'code': 'ID_VALIDATE', 'name': '身份验证手续费'},
  '9': {'code': 'CASH_DRAW_FREEZE', 'name': '取现冻结'},
  '10': {'code': 'BID_FREEZE', 'name': '投标冻结'},
  '11': {'code': 'AUTO_BID', 'name': '自动投标'},
  '12': {'code': 'LOAN_FAILED', 'name': '流标退款'},
  '13': {'code': 'CASH_DRAW_FAILED', 'name': '提现失败退款'},
  '14': {'code': 'CASH_DRAW_FEE', 'name': '提现手续费'},
  '15': {'code': 'CHECKIN_MGMT_FEE', 'name': '借款服务费'},
  '16': {'code': 'CHECKIN_MGMT_FEE_4_HOOMSUN', 'name': '借款管理费_人人金服'},
  '17': {'code': 'OVER_DUE_MGMT_FEE', 'name': '逾期管理费'},
  '18': {'code': 'OVER_DUE_MGMT_FEE_4_HOOMSUN', 'name': '逾期管理费_人人金服'},
  '19': {'code': 'ID_VALIDATE_4_HOOMSUN', 'name': '身份验证手续费'},
  '20': {'code': 'CASH_DRAW_FEE_4_HOOMSUN', 'name': '提现手续费'},
  '21': {'code': 'LOAN_START_FEE_4_HOOMSUN', 'name': '成交手续费'},
  '22': {'code': 'RETURN_FEE_FROM_HOOMSUN', 'name': '返还服务费'},
  '23': {'code': 'CASH_DRAW_BY_MANUAL', 'name': '人工提现'},
  '24': {'code': 'MANUAL_RECHARGE', 'name': '人工充值'},
  '25': {'code': 'GUARANTEE_RECHARGE', 'name': '服务费'},
  '26': {'code': 'FIELDAUDIT_RECHARGE', 'name': '实地审核费'},
  '27': {'code': 'ENTURST_RECHARGE', 'name': '委托代查费'},
  '28': {'code': 'REPAID_BY_GUARANTOR', 'name': '坏账垫付'},
  '29': {'code': 'BALANCE_FEE', 'name': '平衡金'},
  '30': {'code': 'REGISTER_FINANCE_PLAN', 'name': '加入红利计划'},
  '31': {'code': 'FINANCEPLAN_CASHDRAW', 'name': '红利计划回款'},
  '32': {'code': 'SALE_DEBT', 'name': '出售债权'},
  '33': {'code': 'BUY_DEBT', 'name': '购买债权'},
  '34': {'code': 'LOAN_TRANSFER_FEE', 'name': '债权转让管理费'},
  '35': {'code': 'LOAN_TRANSFER_FEE_FOR_HXB', 'name': '债权转让管理费_红小宝'},
  '36': {'code': 'MARKETING_EVENT_BONUS', 'name': '活动奖励'},
  '37': {'code': 'PRINCIPAL_COMPENSATION', 'name': '本金补偿'},
  '38': {'code': 'QUIT_FEE', 'name': '理财计划退出费用'},
  '39': {'code': 'GUARANTEE_RECHARGE_RETURN', 'name': '返还理财计划利息手续费'},
  '40': {'code': 'FINANCE_PLAN_RESERVE_FREEZE', 'name': '红利计划预定冻结定金'},
  '41': {'code': 'FINANCE_PLAN_RESERVE_OVERDUE_FINE', 'name': '红利计划支付超时扣除定金'},
  '42': {'code': 'FINANCE_PLAN_RESERVE_UNFREEZE', 'name': '红利计划预定解冻'},
  '43': {'code': 'FINANCE_PLAN_SERVICE_FEE_4_HOOMSUN', 'name': '红利计划服务费'},
  '44': {'code': 'FINANCE_PLAN_QUIT_ADVANCE_FEE', 'name': '红利计划提前退出费用'},
  '45': {'code': 'FINANCE_PLAN_QUIT_ADVANCE_FEE_4_HOOMSUN', 'name': '红利计划提前退出费用_红小宝'},
  '46': {'code': 'FINANCE_PLAN_QUIT_ADVANCE_FEE_DISCARD', 'name': '红利计划提前退出费用_特殊'},
  '47': {'code': 'FINANCE_PLAN_QUIT_ADVANCE_FEE_4_HOOMSUN_DISCARD', 'name': '红利计划提前退出费用_红小宝_特殊'},
  '48': {'code': 'PAYINSTEAD_FREEZE', 'name': '代付金额冻结'},
  '49': {'code': 'COUPON_4_USER', 'name': '优惠券'},
  '50': {'code': 'COUPON_4_MARKETING', 'name': '优惠券支出'},
  '51': {'code': 'COUPON_4_MARKETING_FREEZE', 'name': '优惠券冻结'},
  '52': {'code': 'COUPON_4_MARKETING_UNFREEZE', 'name': '优惠券解冻'},
  '53': {'code': 'REGISTER_AUTO_INVEST_PLAN', 'name': '加入薪计划'},
  '54': {'code': 'RECHARGE_AUTO_INVEST_PLAN', 'name': '支付薪计划'},
  '55': {'code': 'AUTO_INVEST_PLAN_INTERESTFEE', 'name': '薪计划利息管理费'},
  '56': {'code': 'CHANNEL_RECHARGE_DIFF_SUPPLEMENT', 'name': '还款差额补足'},
  '57': {'code': 'CHANNEL_REPAY_RECHARGE', 'name': '渠道还款充值'},
  '58': {'code': 'ZX_CHANNEL_PAY_FEE', 'name': '红上至信服务费'},
  '59': {'code': 'AS_CHANNEL_PAY_FEE', 'name': '安盛渠道支付服务费'},
  '60': {'code': 'ZDSD_CHANNEL_PAY_FEE', 'name': '证大速贷渠道支付服务费'},
  '61': {'code': 'ZAXY_CHANNEL_PAY_FEE', 'name': '中安信业渠道支付服务费'},
  '62': {'code': 'AMQUE_RECHARGE', 'name': '贷后申请充值'},
  '63': {'code': 'AMQUE_REPAY', 'name': '贷后申请还款'},
  '64': {'code': 'RECHARGE_FEE', 'name': '充值手续费'},
  '65': {'code': 'REPAY_LENDERS_TOTAL_FREEZE', 'name': '冻结给理财人的还款总额'},
  '66': {'code': 'REPAY_LENDERS_TOTAL_UNFREEZE', 'name': '解冻给理财人的还款总额'},
  '67': {'code': 'TRANSFER_FREEZE', 'name': '转账金额冻结'},
  '68': {'code': 'TRANSFER_UNFREEZE', 'name': '转账金额解冻'},
  '69': {'code': 'TRANSFER_ACCOUNT', 'name': '账户转账'},
  '70': {'code': 'RECHARGE_FREEZE', 'name': '充值且冻结'},
  '71': {'code': 'HEIKA_CASH_DRAW', 'name': '黑卡用户提现'},
  '72': {'code': 'HXB_CASH_DRAW', 'name': '红小宝标的放款'},
  '73': {'code': 'ZX_CHANNEL_REPAY_DIFFERENCE', 'name': '至信还款差额补足'},
  '74': {'code': 'START_LOAN_COUPON_TRANSFER_FREEZE', 'name': '放标优惠券对应帐户转帐到借款人冻结'},
  '75': {'code': 'REPAY_GUARANTEE_TOTAL_UNFREEZE', 'name': '解冻给保障金的还款总额'},
  '76': {'code': 'REPAY_BALANCE_TOTAL_UNFREEZE', 'name': '解冻给平衡金的还款总额'},
  '77': {'code': 'REPAY_HXB_TOTAL_UNFREEZE', 'name': '解冻给红小宝人的还款总额'},
  '78': {'code': 'BALANCE_DIFF_TO_BORROWER', 'name': '平衡金补足'},
  '79': {'code': 'FREEZE_BALANCE_DIFF_TO_BORROWER', 'name': '冻结平衡金补足'},
  '80': {'code': 'TRANSFER_BORROWER_TO_HXB_FOR_BALANCE', 'name': '平衡金收取'},
  '81': {'code': 'INTEREST_SETTLE', 'name': '存管托管账户结息'},
  '82': {'code': 'BANLANCE_COLLECTION', 'name': '平衡金收入'},
  '83': {'code': 'CHANNEL_RECHARGE_UNFREEZE', 'name': '渠道充值解冻'},
  '84': {'code': 'AMQUE_RECHARGE_UNFREEZE', 'name': '贷后充值解冻'},
  '85': {'code': 'CHANNEL_RECHARGE_FREEZE', 'name': '渠道充值冻结'},
  '86': {'code': 'START_LOAN_TRANSFER_FREEZE', 'name': '放标转帐冻结'},
  '87': {'code': 'PLATFORM_CASH_DRAW', 'name': '平台提现'},
  '88': {'code': 'CASH_DRAW_FEE_REFUND', 'name': '提现手续费退款'},
  '89': {'code': 'BATCH_MANUAL_RECHARGE', 'name': '人工批量充值'},
  '90': {'code': 'BATCH_SEND_BONUS', 'name': '活动奖励'},
  '91': {'code': 'LOAN_TRANSFER_FREEZE', 'name': '购买债权冻结'},
  '92': {'code': 'LOAN_TRANSFER_UNFREEZE', 'name': '购买债权解冻'},
  '93': {'code': 'LOAN_TRANSFER_FAIL_UNFREEZE', 'name': '存管失败解冻'},
  '94': {'code': 'AUTOINVESTPLAN_CASHDRAW', 'name': '薪计划回款'},
  '95': {'code': 'AUTO_INVEST_PLAN_OVERDUE_FEE', 'name': '薪计划逾期管理费'},
  '96': {'code': 'AUTO_INVEST_PLAN_OVERDUE_HOOMSUN', 'name': '薪计划逾期管理费_红小宝'},
  '97': {'code': 'CHG_MOBILE_PLATFORM', 'name': '平台发起手机号修改'},
  '98': {'code': 'PXD_CASH_DRAW', 'name': '培训贷标的放款'},
  '99': {'code': 'FEE_TRANS', 'name': '费用结转'},
  '100': {'code': 'NEWFINANCEPLAN_CASHDRAW', 'name': '月升计划回款'},
  '101': {'code': 'REGISTER_FINANCE_PLAN_NEW', 'name': '加入月升计划'},
  '102': {'code': 'NEWPLAN_SERVICE_FEE_4_HOOMSUN', 'name': '月升计划服务费'},
  '103': {'code': 'NEWPLAN_QUIT_ADVANCE_FEE', 'name': '月升计划提前退出费用'},
  '104': {'code': 'NEWPLAN_QUIT_ADVANCE_FEE_4_HOOMSUN', 'name': '月升计划提前退出费用_红小宝'},
  '105': {'code': 'RECHARGE_FAST', 'name': '快捷充值'},
  '106': {'code': 'CASH_DRAW_SPECIAL', 'name': '特殊提现'},
  '107': {'code': 'FINANCEPLAN_QUIT_CASHDRAW', 'name': '红利计划退出'},
  '108': {'code': 'XX_CHANNEL_PAY_FEE', 'name': '红上XX服务费'},
  '109': {'code': 'ZX_CHANNEL_PAY_FEE_REFUND', 'name': '红上至信服务费返还'},
  '110': {'code': 'CHECKIN_MGMT_FEE_REFUND', 'name': '借款服务费返还'},
  '111': {'code': 'XX_CHANNEL_PAY_FEE_REFUND', 'name': '红上XX服务费返还'}
};
// 批量还款 批次状态
exports.REPAY_BATCH_STATUS = {
  'UNPROCESS': '未操作',
  'PROCESSING': '处理中',
  'RECHARGE_FAILURE': '充值失败',
  'REPAY_FAILURE': '还款失败',
  'REPAY_FAILURE_INSUFFICIENT_AMOUNT': '余额不足',
  'REPAY_SUCCESS': '还款成功',
  'WAIT_AUDIT': '等待审批',
  'AUDIT_PASS': '审批通过',
  'AUDIT_REJECT': '审批驳回',
  'CANCEL': '撤销'
};
// 批量还款 批次状态
exports.REPAY_BATCH_AUDIT_STATUS = {
  'WAITTING': '等待审批',
  'PASS': '审批通过',
  'REJECT': '审批驳回',
  'CANCEL': '撤销',
  'PROCESSING': '处理中',
  'REPAY_FAIL': '还款失败',
  'REPAY_SUCCESS': '还款完成'
};
// 批量还款 批次充值状态
exports.REPAY_BATCH_RECHARGE_STATUS = {
  'UNPROCESS': '未处理',
  'PROCESSING': '处理中',
  'VALID_FAILURE': '验证失败',
  'SUCCESS': '成功',
  'FAILURE': '失败',
  'ORDER_FAIL': '订单失败',
  'PART_SUCCESS': '部分成功'
};
// 充值状态
exports.CHARGE_STATUS = {
  '0': '支付中',
  '1': '充值成功',
  '2': '充值失败'
};
// 提现状态
exports.WITHDRAW_STATUS = {
  'NEW_APPLY': '新申请',
  'CHECK_ERROR': '未通过',
  'WAIT_CASHDRAW': '等待提现',
  'INPROCESS': '处理中',
  'REFUND': '退票',
  'REFUND_RECHARGED': '退票已充值',
  'REJECTED': '已驳回',
  'CASHDRAW_FAILED': '提现失败',
  'CASHDRAW_SUCCESS': '提现成功',
  'SPECIAL_APPLY': '特殊提现申请',
  'REVOKED': '已撤销',
  'PLATFORM_APPLY': '平台提现申请',
  'REJECTED_PROCESS': '驳回已处理',
  'REFUND_REC_PROCESS': '退票充值已处理',
  'CASHDRAW_FA_PROCESS': '提现失败已处理',
  'CHANNEL_REJECTED': '渠道已驳回'
};
// 提现来源
exports.WITHDRAW_TYPE = {
  'WEB_DRAWCASH': '网站提现',
  'MOBILE_DRAWCASH': '手机提现',
  'AUTO_DRAWCASH': '渠道自动提现',
  'FINANCEPLAN_AUTOCASHDRAW': '理财计划自动提现',
  'MANUAL_DRAWCASH': '人工提现',
  'SPECIAL_DRAWCASH': '特殊提现',
  'PLATFORM_DRAWCASH': '平台账户提现'
};
// 提现通道
exports.WITHDRAW_CHANNEL = {
  'FUYOU': '富友'
};
// 债权转让状态
exports.TRANSFER_STATUS = {
  'TRANSFERING': '正在转让',
  'TRANSFERED': '转让完毕',
  'CANCLE': '已取消',
  'CLOSED_CANCLE': '结标取消',
  'OVERDUE_CANCLE': '逾期取消',
  'PRESALE': '转让预售'
};
// 银行状态
exports.BANK_STATUS = {
  '0': '禁用',
  '1': '网易代扣',
  '2': '银行限额维护'
};
// 标的状态
exports.parseLoanStatus = function(id) {
  return findByIdOrCode(id, exports.LOAN_STATUS);
};
// 还款类型
exports.parseLoanType = function(id) {
  return exports.LOAN_TYPE[id];
};
// 婚姻状态
exports.parseLoanMarriageStatus = function(id) {
  return exports.LOAN_MARRIAGE_STATUS[id];
};
// 还款方式
exports.parseLoanRepaidType = function(id) {
  return exports.LOAN_REPAID_TYPE[id];
};
// 投标方式
exports.parseLoanLenderType = function(id) {
  return exports.LOAN_LENDER_TYPE[id];
};
// 计划状态
exports.parsePlanStatus = function(id) {
  return exports.PLAN_STATUS[id];
};
// 计划类型
exports.parsePlanFinancePlanType = function(id) {
  return exports.PLAN_FINANCE_PLAN_TYPE[id];
};
// 计划子账户状态
exports.parsePlanSubAccountStatus = function(id) {
  return exports.PLAN_SUB_ACCOUNT_STATUS[id];
};
// 计划子账户状态
exports.parsePlanCashType = function(id) {
  return exports.PLAN_CASH_TYPE[id];
};
// 计划持有明细 退出方式
exports.parsePlanQuitWay = function(id) {
  return exports.PLAN_QUIT_WAY[id];
};
// 计划子账户交易记录子类型
exports.parsePlanFundSubType = function(id) {
  return findByIdOrCode(id, exports.PLAN_FUND_SUB_TYPE);
};
// 交易记录类型，显示大类
exports.parseFundDisplayType = function(id) {
  return findByIdOrCode(id, exports.FUND_DISPLAY_TYPE);
};
// 交易记录子类型
exports.parseFundSubType = function(id) {
  return findByIdOrCode(id, exports.FUND_SUB_TYPE);
};
// 批量还款 批次状态
exports.parseRepayBatchStatus = function(id) {
  return exports.REPAY_BATCH_STATUS[id];
};
// 批量还款 批次审批状态
exports.parseRepayBatchAuditStatus = function(id) {
  return exports.REPAY_BATCH_AUDIT_STATUS[id];
};
// 批量还款 批次充值状态
exports.parseRepayBatchRechargeStatus = function(id) {
  return exports.REPAY_BATCH_RECHARGE_STATUS[id];
};
// 充值状态
exports.parseChargeStatus = function(id) {
  return exports.CHARGE_STATUS[id];
};
// 提现状态
exports.parseWithdrawStatus = function(id) {
  return exports.WITHDRAW_STATUS[id];
};
// 提现来源
exports.parseWithdrawType = function(id) {
  return exports.WITHDRAW_TYPE[id];
};
// 提现来源
exports.parseWithdrawChannel = function(id) {
  return exports.WITHDRAW_CHANNEL[id];
};
// 债权转让状态
exports.parseTransferStatus = function(id) {
  return exports.TRANSFER_STATUS[id];
};
exports.parseBankStatus = function(id) {
  return exports.BANK_STATUS[id];
};

function findByIdOrCode(id, dict) {
  return dict[id] || find(dict, {code: id});
}
