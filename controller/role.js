
'use strict';

/**
 * channel
 */
const debug = require('debug')('controller:role');

// const ErrMsg = require('../util/message.js');
const { _ } = require('../util/index.js');

const HTTP_POST = 'POST';

// 列表
exports.query = async(ctx, next) => {
  const service = ctx.service.role;

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

  let ret;
  let dataList;
  let roleList;
  let ids;
  let roleTasks = [];
  // 保存
  if (ctx.method === HTTP_POST) {
    ids = ctx.checkBody('roles').value;
    if (ids && !_.isArray(ids)) {
      ids = [ids];
    }
    ids = ids || [];
    ids.forEach(v => {
      let _role = ctx.checkBody(`role_${v}`).value;
      if (_role && !_.isArray(_role)) {
        _role = [_role];
      }
      if (_role && _role.length) {
        roleTasks.push(
          (`${v}:` + _role.join(','))
        );
      } else {
        roleTasks.push(`${v}:`);
      }
    });
    query.roleTasks = roleTasks.join(';');
    debug('query', query);
    try {
      ret = await service.update(query);
      debug('update success');
      ctx.redirect('/role');
    } catch (error) {
      ctx.body = error;
      return;
    }
  }

  try {
    ret = await service.query(query);
    dataList = _.get(ret, 'taskWithRoles');
    roleList = _.get(ret, 'roleTitle');
  } catch (error) {
    ctx.body = error;
    return;
  }
  dataList && dataList.length && dataList.forEach(x => {
    x.roleMap = {};
    x.roles && x.roles.forEach(ele => {
      if (ele.ispermission) {
        x.roleMap[ele.role_id] = true;
      }
    });
  });
  Object.assign(ctx.state, {
    dataList,
    roleList,
    query
  });
  await next();
};
