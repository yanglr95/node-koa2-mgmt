
'use strict';

/**
 * message
 */
module.exports = {
  def: '操作失败，稍后重试',
  unknowAction: '未知的操作',
  success: '操作成功',
  remove: '删除成功',
  // login
  login: '请输入正确的用户名和密码',
  name: '请输入正确的名称',
  title: '请输入正确的标题',
  image: '请输入正确的图片地址',
  url: '请输入正确的链接地址',
  date: '请输入正确日期',
  content: '请输入内容',
  amount: '请输入正确的金额',
  safePwd: '6-20位数字和大小写字母',
  // time
  releaseTime: '请输入正确的发布时间',
  joinTime: '请输入正确的加入时间',
  endTime: '请输入正确的结束时间',
  startTime: '请输入正确的开始时间',
  quitTime: '请输入正确退出时间',
  urlType: '地址类型不能为空',
  effectiveTime: '请输入正确的开始结束时间',
  frequency: '请选择展示频率',
  beforeTime: function(a, b) {
    return `请输入正确的${a}时间，需早于${b}时间`;
  },
  afterTime: function(a, b) {
    return `请输入正确的${a}时间，需晚于${b}时间`;
  },
  // plan
  planAmount: '请输入正确的金额，100的整数倍',
  minJoinAmount: '请输入正确的加入额度下限，100的整数倍，且小于等于发布额度',
  maxJoinAmount: '请输入正确的加入额度上限，100的整数倍，且大于下限',
  appendAmount: '请输入正确的追加金额倍数，100的整数倍',
  expireTime: '失效时间不能为空',
  fixPeriod: '固定天数不能为空'
};
