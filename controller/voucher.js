/**
 * voucher
 */
// const debug = require('debug')('controller:voucher');

const {
  reMobile
} = require('../util/index.js');

const HTTP_POST = 'POST';

exports.grant = async(ctx, next) => {
  const service = ctx.service.voucher;
  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  let query = {
    staffId,
    staffName,
    ipAddress
  };
  let tip;
  if (HTTP_POST == ctx.method) {
    query.phone = ctx.checkBody('phone').notEmpty(tip = '请输入正确的手机号').trim().match(reMobile, tip).value;
    query.value = ctx.checkBody('value').notEmpty(tip = '请选择京东卡面额').value;
    query.phoneMsg = ctx.checkBody('phoneMsg').notEmpty(tip = '请输入短信内容').trim().value;
    query.webMsg = ctx.checkBody('webMsg').notEmpty(tip = '请输入站内信内容').trim().value;

    ctx.state.query = query;

    if (ctx.errors) {
      await next();
      return;
    }

    try {
      await service.create(query);
      ctx.state.success = true;
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  await next();
};
