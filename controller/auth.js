
'use strict';

/**
 * auth
 **/
const debug = require('debug')('controller:auth');

const ErrMsg = require('../util/message.js');
const { _, safePwd } = require('../util/index.js');

const HTTP_POST = 'POST';

// login required
exports.loginRequired = async(ctx, next) => {
  const { isLogin } = ctx.state;
  debug('loginRequired:', isLogin);
  if (!isLogin) {
    return ctx.redirect('/login');
  }
  await next();
};

// login check
exports.loginCheck = async(ctx, next) => {
  const { isLogin } = ctx.state;
  debug('loginCheck:', isLogin);
  if (isLogin) {
    return ctx.redirect('/');
  }
  await next();
};

// login
exports.login = async(ctx, next) => {
  const service = ctx.service.auth;
  let loginTimes = ctx.session.loginTimes || 0;
  let times;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const method = ctx.method;
  let query = {
    staffId,
    staffName,
    ipAddress
  };
  let ret;

  if (method === HTTP_POST) {
    if (loginTimes > 4) {
      ctx.addError('page', '登录失败过多,账户已锁定！');
      await next();
      return;
    }
    query.username = ctx.checkBody('username').trim()
      .notEmpty(ErrMsg.login)
      .len(2, 20, ErrMsg.login)
      .value;
    query.password = ctx.checkBody('password').trim()
      .notEmpty(ErrMsg.login)
      .len(6, 20, ErrMsg.login)
      .match(safePwd, ErrMsg.safePwd)
      .value;

    // query data for page render
    ctx.state.query = query;
    if (ctx.errors) {
      debug('login.post.errors:', ctx.errors);
      await next();
      return;
    }
    debug('login.query', query);
    try {
      ret = await service.fetch(query);
    } catch (error) {
      debug(error);
      loginTimes = ctx.session.loginTimes = loginTimes + 1;
      times = 5 - loginTimes;
      if (times == 0) {
        ctx.addError('page', '登录失败过多,账户已锁定！');
      } else {
        ctx.addError('page', '您的用户名密码不正确，失败' + times + '次后锁定不能登录');
      }
      // ctx.addError('page', error.message || ErrMsg.def);
      await next();
      return;
    }
    ctx.session.isAdminLogin = true;
    ctx.session.adminUser = {
      id: _.get(ret, 'staffId', 0),
      name: query.username,
      time: Date.now()
    };
    return ctx.redirect('/');
  }
  debug('login');
  await next();
};

// logout
exports.logout = async(ctx, next) => {
  ctx.session.isAdminLogin = false;
  delete ctx.session.adminUser;
  ctx.redirect('/login');
};

exports.smscode = async(ctx, next) => {
  const service = ctx.service.auth;

  const {
    staffId,
    staffName,
    ipAddress
  } = ctx.parseParams();

  const method = ctx.method;
  let query = {
    staffId,
    staffName,
    ipAddress
  };
  let ret;
  ctx.state.query = query;
  if (method === HTTP_POST) {
    query.mobile = ctx.checkBody('mobile').value;
    query.type = 'REGISTER';
    debug('auth.smscode.check', query);
    try {
      ret = await service.query(query);
      debug('auth.smscode.value', ret);
      ctx.state.dataList = ret;
    } catch (error) {
      debug(error);
      await next();
      return;
    }
  }
  await next();
};
