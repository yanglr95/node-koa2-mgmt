
'use strict';

/**
 * service
 */
module.exports = (app, config) => {
  const service = app.context.service = {};
  service.auth = require('./auth.js');
  service.banner = require('./banner.js');
  service.announce = require('./announce.js');
  service.loan = require('./loan.js');
  service.plan = require('./plan.js');
  service.planTemplate = require('./plan.template.js');
  service.planSetting = require('./plan.setting.js');
  service.user = require('./user.js');
  service.userMemo = require('./user.memo.js');
  service.repayment = require('./repayment.js');
  service.charge = require('./charge.js');
  service.withdraw = require('./withdraw.js');
  service.appFeatured = require('./app.featured.js');
  service.appRaise = require('./app.raise.js');
  service.product = require('./product.js');
  service.channel = require('./channel.js');
  service.role = require('./role.js');
  service.feedback = require('./feedback.js');
  service.splash = require('./app.splash.js');
  service.discount = require('./discount.js');
  service.cashback = require('./cashback.js');
  service.bank = require('./bank.js');
  service.popups = require('./popups.js');
  service.voucher = require('./voucher.js');
  return app;
};
