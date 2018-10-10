
'use strict';

/**
 * router
 **/

const Router = require('koa-router');

// mock
// require('../mock/mockdata.js');

// controller
const home = require('./home.js');
const auth = require('./auth.js');
const banner = require('./banner.js');
const announce = require('./announce.js');
const loan = require('./loan.js');
const plan = require('./plan.js');
const planTemplate = require('./plan.template.js');
const user = require('./user.js');
const product = require('./product.js');
const channel = require('./channel.js');
const contract = require('./contract.js');
const repayment = require('./repayment.js');
const charge = require('./charge.js');
const withdraw = require('./withdraw.js');
const template = require('./template.js');
const upload = require('./upload');
const appHome = require('./app.home.js');
const appBanner = require('./app.banner.js');
const appRaise = require('./app.raise.js');
const appPopups = require('./app.popups.js');
const appAnnounce = require('./app.announce.js');
const appSplash = require('./app.splash.js');
const role = require('./role.js');
const feedback = require('./feedback.js');
const discount = require('./discount.js');
const cashback = require('./cashback.js');
const bank = require('./bank.js');
const voucher = require('./voucher.js');
const router = new Router();

// router
router
  .get('/app', auth.loginRequired, appHome.home, template.html('app.home.pug'))
  // app featured
  .get('/app/featured', auth.loginRequired, appHome.featured, template.html('app.featured.pug'))
  .post('/app/featured', auth.loginRequired, appHome.featured, template.html('app.featured.pug'))
  // app popups
  .get('/app/popups', auth.loginRequired, appPopups.query, template.html('app.popups.index.pug'))
  .get('/app/popups/create', auth.loginRequired, template.html('app.popups.detail.pug'))
  .post('/app/popups/remove', auth.loginRequired, appPopups.remove)
  .post('/app/popups/:id', auth.loginRequired, appPopups.createOrUpdate, template.html('app.popups.detail.pug'))
  .get('/app/popups/:action/:id', auth.loginRequired, appPopups.detail, template.html('app.popups.detail.pug'))
  .post('/app/popups/edit/:id', auth.loginRequired, appPopups.createOrUpdate, template.html('app.popups.detail.pug'))
  // app banner
  .get('/app/banner', auth.loginRequired, appBanner.query, template.html('app.banner.index.pug'))
  .get('/app/banner/create', auth.loginRequired, template.html('app.banner.detail.pug'))
  .post('/app/banner/remove', auth.loginRequired, appBanner.remove)
  .get('/app/banner/:id', auth.loginRequired, appBanner.detail, template.html('app.banner.detail.pug'))
  .post('/app/banner/:id', auth.loginRequired, appBanner.createOrUpdate, template.html('app.banner.detail.pug'))
  // app splash
  .get('/app/splash', auth.loginRequired, appSplash.query, template.html('app.splash.index.pug'))
  .get('/app/splash/create', auth.loginRequired, appSplash.createOrUpdate, template.html('app.splash.detail.pug'))
  .post('/app/splash/remove', auth.loginRequired, appSplash.remove)
  .get('/app/splash/:id', auth.loginRequired, appSplash.detail, template.html('app.splash.detail.pug'))
  .post('/app/splash/:id', auth.loginRequired, appSplash.createOrUpdate, template.html('app.splash.detail.pug'))
  // app announce
  .get('/app/announce', auth.loginRequired, appAnnounce.query, template.html('app.announce.index.pug'))
  .get('/app/announce/create', auth.loginRequired, template.html('app.announce.detail.pug'))
  .post('/app/announce/remove', auth.loginRequired, appAnnounce.remove)
  .get('/app/announce/:id', auth.loginRequired, appAnnounce.detail, template.html('app.announce.detail.pug'))
  .post('/app/announce/:id', auth.loginRequired, appAnnounce.createOrUpdate, template.html('app.announce.detail.pug'))
  .get('/app/feedback', auth.loginRequired, feedback.query, template.html('feedback.index.pug'))
  .post('/app/feedback', auth.loginRequired, feedback.query, template.html('feedback.index.pug'))
  // app raise
  .get('/app/raise', auth.loginRequired, appRaise.query, template.html('app.raise.index.pug'))
  .get('/app/raise/create', auth.loginRequired, template.html('app.raise.detail.pug'))
  .post('/app/raise/remove', auth.loginRequired, appRaise.remove)
  .get('/app/raise/:id', auth.loginRequired, appRaise.detail, template.html('app.raise.detail.pug'))
  .post('/app/raise/:id', auth.loginRequired, appRaise.createOrUpdate, template.html('app.raise.detail.pug'))
  // banner
  .get('/banner', auth.loginRequired, banner.query, template.html('banner.index.pug'))
  .get('/banner/create', auth.loginRequired, template.html('banner.detail.pug'))
  .post('/banner/remove', auth.loginRequired, banner.remove)
  .get('/banner/:id', auth.loginRequired, banner.detail, template.html('banner.detail.pug'))
  .post('/banner/:id', auth.loginRequired, banner.createOrUpdate, template.html('banner.detail.pug'))
  // announce
  .get('/announce', auth.loginRequired, announce.query, template.html('announce.index.pug'))
  .get('/announce/create', auth.loginRequired, template.html('announce.detail.pug'))
  .post('/announce/remove', auth.loginRequired, announce.remove)
  .get('/announce/:id', auth.loginRequired, announce.detail, template.html('announce.detail.pug'))
  .post('/announce/:id', auth.loginRequired, announce.createOrUpdate, template.html('announce.detail.pug'))
  // loan
  .get('/loan', auth.loginRequired, loan.query, template.html('loan.index.pug'))
  .post('/loan', auth.loginRequired, loan.query, template.html('loan.index.pug'))
  .get('/loan/setting', auth.loginRequired, loan.setting, template.html('loan.setting.pug'))
  .get('/loan/:id', auth.loginRequired, loan.detail, template.html('loan.detail.pug'))
  .post('/loan/:id', auth.loginRequired, loan.detail, template.html('loan.detail.pug'))
  .get('/loan/:id/lender', auth.loginRequired, loan.lender, template.html('loan.lender.pug'))
  .get('/loan/:id/contract', auth.loginRequired, loan.contract)
  .get('/transfer', auth.loginRequired, loan.transferQuery, template.html('transfer.index.pug'))
  .post('/transfer', auth.loginRequired, loan.transferQuery, template.html('transfer.index.pug'))
  .get('/transfer/:id', auth.loginRequired, loan.transferDetail, template.html('transfer.detail.pug'))
  .post('/transfer/:id', auth.loginRequired, loan.transferDetail, template.html('transfer.detail.pug'))
  // plan
  .get('/plan', auth.loginRequired, plan.query, template.html('plan.index.pug'))
  .post('/plan', auth.loginRequired, plan.query, template.html('plan.index.pug'))
  .get('/plan/create', auth.loginRequired, template.html('plan.create.pug'))
  .post('/plan/create', auth.loginRequired, plan.create, template.html('plan.create.pug'))
  .get('/plan/create/:id', auth.loginRequired, plan.template, template.html('plan.create.pug'))
  .post('/plan/create/:id', auth.loginRequired, plan.template, plan.create, template.html('plan.create.pug'))
  .post('/plan/update/:id', auth.loginRequired, plan.update)
  .get('/plan/setting', auth.loginRequired, plan.setting, template.html('plan.setting.pug'))
  .post('/plan/setting', auth.loginRequired, plan.setting, template.html('plan.setting.pug'))
  .get('/plan/batch', auth.loginRequired, plan.batch, template.html('plan.batch.pug'))
  .post('/plan/batch', auth.loginRequired, plan.batch, template.html('plan.batch.pug'))
  .get('/plan/template', auth.loginRequired, planTemplate.query, template.html('plan.template.index.pug'))
  .post('/plan/template', auth.loginRequired, planTemplate.query, template.html('plan.template.index.pug'))
  .get('/plan/template/create', auth.loginRequired, template.html('plan.template.create.pug'))
  .post('/plan/template/create', auth.loginRequired, planTemplate.createOrUpdate, template.html('plan.template.create.pug'))
  .get('/plan/template/:id', auth.loginRequired, planTemplate.detail, template.html('plan.template.create.pug'))
  .post('/plan/template/:id', auth.loginRequired, planTemplate.createOrUpdate, template.html('plan.template.create.pug'))
  .get('/plan/count', auth.loginRequired, plan.count, template.html('plan.count.pug'))
  .post('/plan/count', auth.loginRequired, plan.count, template.html('plan.count.pug'))
  .get('/plan/count/:nav', auth.loginRequired, plan.count, template.html('plan.count.pug'))
  .post('/plan/count/:nav', auth.loginRequired, plan.count, template.html('plan.count.pug'))
  .get('/plan/:id', auth.loginRequired, plan.detail, template.html('plan.detail.pug'))
  .post('/plan/:id', auth.loginRequired, plan.detail, template.html('plan.detail.pug'))
  .get('/plan/:id/record', auth.loginRequired, plan.record, template.html('plan.record.pug'))
  .post('/plan/:id/record', auth.loginRequired, plan.record, template.html('plan.record.pug'))
  // channel
  .get('/channel', auth.loginRequired, channel.query, template.html('channel.index.pug'))
  .post('/channel', auth.loginRequired, channel.query, template.html('channel.index.pug'))
  .get('/channel/create', auth.loginRequired, template.html('channel.detail.pug'))
  .post('/channel/create', auth.loginRequired, channel.createOrUpdate, template.html('channel.detail.pug'))
  .get('/channel/:id', auth.loginRequired, channel.detail, template.html('channel.detail.pug'))
  .post('/channel/:id', auth.loginRequired, channel.createOrUpdate, template.html('channel.detail.pug'))
  // contract
  .get('/contract', auth.loginRequired, contract.query, template.html('contract.index.pug'))
  // product
  .get('/product', auth.loginRequired, product.query, template.html('product.index.pug'))
  .post('/product', auth.loginRequired, product.query, template.html('product.index.pug'))
  .get('/product/create', auth.loginRequired, product.create, template.html('product.detail.pug'))
  .post('/product/create', auth.loginRequired, product.createOrUpdate, template.html('product.detail.pug'))
  .get('/product/:id', auth.loginRequired, product.detail, template.html('product.detail.pug'))
  .post('/product/:id', auth.loginRequired, product.createOrUpdate, product.detail, template.html('product.detail.pug'))
  // repayment
  .get('/repayment', auth.loginRequired, repayment.query, template.html('repayment.index.pug'))
  .post('/repayment', auth.loginRequired, repayment.query, template.html('repayment.index.pug'))
  .get('/repayment/batch', auth.loginRequired, repayment.batch, template.html('repayment.batch.pug'))
  .post('/repayment/batch', auth.loginRequired, repayment.batch, template.html('repayment.batch.pug'))
  .get('/repayment/history', auth.loginRequired, repayment.history, template.html('repayment.history.pug'))
  .post('/repayment/history', auth.loginRequired, repayment.history, template.html('repayment.history.pug'))
  .get('/repayment/history/:id', auth.loginRequired, repayment.historyDetail, template.html('repayment.history.detail.pug'))
  .get('/repayment/history/:id/download', auth.loginRequired, repayment.historyDownload)
  .get('/repayment/batch/:id', auth.loginRequired, repayment.batchDetail, template.html('repayment.batch.detail.pug'))
  .post('/repayment/batch/:id', auth.loginRequired, repayment.batchDetail, template.html('repayment.batch.detail.pug'))
  .get('/repayment/batch/:id/download', auth.loginRequired, repayment.batchDownload)
  // .get('/repayment/:id', auth.loginRequired, repayment.detail, template.html('repayment.detail.pug'))
  // role
  .get('/role', auth.loginRequired, role.query, template.html('role.index.pug'))
  .post('/role', auth.loginRequired, role.query, template.html('role.index.pug'))
  // charge
  .get('/charge', auth.loginRequired, charge.query, template.html('charge.index.pug'))
  .post('/charge', auth.loginRequired, charge.query, template.html('charge.index.pug'))
  .get('/charge/count', auth.loginRequired, charge.count, template.html('charge.count.pug'))
  .post('/charge/count', auth.loginRequired, charge.count, template.html('charge.count.pug'))
  .get('/charge/:id', auth.loginRequired, charge.query, template.html('charge.detail.pug'))
  .get('/bank/list', bank.banklist, template.html('bank.list.pug'))
  .get('/bank/list/edit/:id', bank.bankLimitEdit, template.html('bank.limit.update.pug'))
  .post('/bank/list/edit/:id', bank.bankEdit, template.html('bank.limit.update.pug'))
  .get('/bank/add', template.html('bank.limit.update.pug'))
  .post('/bank/add', bank.bankEdit, template.html('bank.limit.update.pug'))
  .get('/bank/order', bank.bankListOrder, template.html('bank.list.order.pug'))
  .post('/bank/order', bank.bankListOrder, template.html('bank.list.order.pug'))
  // withdraw
  .get('/withdraw', auth.loginRequired, withdraw.query, template.html('withdraw.index.pug'))
  .post('/withdraw', auth.loginRequired, withdraw.query, template.html('withdraw.index.pug'))
  .get('/withdraw/count', auth.loginRequired, withdraw.count, template.html('withdraw.count.pug'))
  .post('/withdraw/count', auth.loginRequired, withdraw.count, template.html('withdraw.count.pug'))
  .get('/withdraw/word', auth.loginRequired, withdraw.queryWord, template.html('withdraw.word.index.pug'))
  .post('/withdraw/word', auth.loginRequired, withdraw.queryWord, template.html('withdraw.word.index.pug'))
  .get('/withdraw/word/create', auth.loginRequired, template.html('withdraw.word.detail.pug'))
  .post('/withdraw/word/create', auth.loginRequired, withdraw.updateWord, template.html('withdraw.word.detail.pug'))
  .get('/withdraw/batch', auth.loginRequired, withdraw.batch, template.html('withdraw.batch.pug'))
  .post('/withdraw/batch', auth.loginRequired, withdraw.batch, template.html('withdraw.batch.pug'))
  .get('/withdraw/batch/:id', auth.loginRequired, withdraw.batchDetail, template.html('withdraw.batch.detail.pug'))
  .post('/withdraw/batch/:id', auth.loginRequired, withdraw.batchDetail, template.html('withdraw.batch.detail.pug'))
  .post('/withdraw/update/:id', auth.loginRequired, withdraw.batchUpdate)
  .post('/withdraw/update', auth.loginRequired, withdraw.async)
  .get('/withdraw/:id', auth.loginRequired, withdraw.detail, template.html('withdraw.detail.pug'))
  .post('/withdraw/:id', auth.loginRequired, withdraw.detail, template.html('withdraw.detail.pug'))
  // cashback
  .get('/cashback', auth.loginRequired, cashback.query, template.html('cashback.index.pug'))
  .post('/cashback', auth.loginRequired, cashback.query, template.html('cashback.index.pug'))
  .get('/cashback/ratio', auth.loginRequired, cashback.fetch, template.html('cashback.ratio.pug'))
  .post('/cashback/ratio', auth.loginRequired, cashback.fetch, template.html('cashback.ratio.pug'))
  .get('/cashback/:id/edit', auth.loginRequired, cashback.update, template.html('cashback.ratio.edit.pug'))
  .post('/cashback/:id/edit', auth.loginRequired, cashback.update, template.html('cashback.ratio.edit.pug'))
  // discount
  .get('/discount/:action', auth.loginRequired, discount.query, template.html('discount.home.pug'))
  .post('/discount/:action', auth.loginRequired, discount.query, template.html('discount.home.pug'))
  .get('/discount/:action/create', auth.loginRequired, discount.create, template.html('discount.create.home.pug'))
  .post('/discount/:action/create', auth.loginRequired, discount.create, template.html('discount.create.home.pug'))
  .get('/discount/:id/:action/issue', auth.loginRequired, discount.issue, template.html('discount.issue.home.pug'))
  .post('/discount/:id/:action/issue', auth.loginRequired, discount.issue, template.html('discount.issue.home.pug'))
  .get('/discount/:id/:action/invalid', auth.loginRequired, discount.invalid, template.html('discount.invalid.pug'))
  .post('/discount/:id/:action/invalid', auth.loginRequired, discount.invalid, template.html('discount.invalid.pug'))
  .get('/discount/:action/:id', auth.loginRequired, discount.detail, template.html('discount.detail.home.pug'))
  .post('/discount/:action/:id', auth.loginRequired, discount.detail, template.html('discount.detail.home.pug'))
  // voucher
  .get('/voucher/grant', auth.loginRequired, voucher.grant, template.html('voucher.grant.pug'))
  .post('/voucher/grant', auth.loginRequired, voucher.grant, template.html('voucher.grant.pug'))
  // user
  .get('/user', auth.loginRequired, user.query, template.html('user.index.pug'))
  .post('/user', auth.loginRequired, user.query, template.html('user.index.pug'))
  .get('/user/forbid', auth.loginRequired, user.forbidList, template.html('user.forbid.list.pug'))
  .post('/user/forbid', auth.loginRequired, user.forbidList, template.html('user.forbid.list.pug'))
  .get('/user/:id', auth.loginRequired, user.detail, template.html('user.detail.pug'))
  .post('/user/:id', auth.loginRequired, user.detail, template.html('user.detail.pug'))
  .post('/user/:id/update', auth.loginRequired, user.update)
  .get('/user/:id/forbid', auth.loginRequired, user.forbid, template.html('user.forbid.pug'))
  .post('/user/:id/forbid', auth.loginRequired, user.forbid, template.html('user.forbid.pug'))
  .get('/user/:id/invite', auth.loginRequired, user.invite, template.html('user.invite.pug'))
  .post('/user/:id/invite', auth.loginRequired, user.invite, template.html('user.invite.pug'))
  .get('/user/:id/mobile', auth.loginRequired, user.mobile, template.html('user.mobile.pug'))
  .post('/user/:id/mobile', auth.loginRequired, user.mobile, template.html('user.mobile.pug'))
  .get('/user/:id/charge', auth.loginRequired, user.charge, template.html('user.charge.pug'))
  .post('/user/:id/charge', auth.loginRequired, user.charge, template.html('user.charge.pug'))
  .get('/user/:id/transfer', auth.loginRequired, user.transfer, template.html('user.transfer.pug'))
  .post('/user/:id/transfer', auth.loginRequired, user.transfer, template.html('user.transfer.pug'))
  .get('/user/:id/withdraw', auth.loginRequired, user.withdraw, template.html('user.withdraw.pug'))
  .post('/user/:id/withdraw', auth.loginRequired, user.withdraw, template.html('user.withdraw.pug'))
  .get('/user/:id/idcard', auth.loginRequired, user.idcard, template.html('user.idcard.pug'))
  .post('/user/:id/idcard', auth.loginRequired, user.idcard, template.html('user.idcard.pug'))
  .get('/user/:id/openaccount', auth.loginRequired, user.openAccount, template.html('user.open.account.pug'))
  .post('/user/:id/openaccount', auth.loginRequired, user.openAccount, template.html('user.open.account.pug'))
  .get('/user/:id/bankcard', auth.loginRequired, user.bankcard, template.html('user.bankcard.pug'))
  .post('/user/:id/bankcard', auth.loginRequired, user.bankcard, template.html('user.bankcard.pug'))
  .get('/user/:id/fund', auth.loginRequired, user.fund, template.html('user.fund.pug'))
  .post('/user/:id/fund', auth.loginRequired, user.fund, template.html('user.fund.pug'))
  .get('/user/:id/asset', auth.loginRequired, user.asset, template.html('user.asset.pug'))
  .post('/user/:id/asset', auth.loginRequired, user.asset, template.html('user.asset.pug'))
  .get('/user/:id/statics', auth.loginRequired, user.statics, template.html('user.statics.home.pug'))
  .post('/user/:id/statics', auth.loginRequired, user.statics, template.html('user.statics.home.pug'))
  .get('/user/:id/bind', auth.loginRequired, user.bind, template.html('user.invite.bind.pug'))
  .post('/user/:id/bind', auth.loginRequired, user.bind, template.html('user.invite.bind.pug'))
  .get('/user/:id/unbind', auth.loginRequired, user.unbind, template.html('user.invite.unbind.pug'))
  .post('/user/:id/unbind', auth.loginRequired, user.unbind, template.html('user.invite.unbind.pug'))
  .get('/user/:id/plan/:planid', auth.loginRequired, user.plan, template.html('user.plan.pug'))
  .post('/user/:id/plan/:planid', auth.loginRequired, user.plan, template.html('user.plan.pug'))
  .get('/user/:id/plan/:planid/quit', auth.loginRequired, user.planQuit, template.html('user.plan.quit.pug'))
  .post('/user/:id/plan/:planid/quit', auth.loginRequired, user.planQuit, template.html('user.plan.quit.pug'))
  .get('/smscode', auth.loginRequired, auth.smscode, template.html('smscode.check.pug'))
  .post('/smscode', auth.loginRequired, auth.smscode, template.html('smscode.check.pug'))
  // upload
  .post('/uploadfile/:action', auth.loginRequired, upload.file)
  // auth
  .get('/login', auth.loginCheck, auth.login, template.html('login.pug'))
  .post('/login', auth.loginCheck, auth.login, template.html('login.pug'))
  .get('/logout', auth.logout)
  // home
  .get('/', auth.loginRequired, home, template.html('home.pug'));

module.exports = app => {
  app
    .use(router.routes())
    .use(router.allowedMethods());
  return app;
};
