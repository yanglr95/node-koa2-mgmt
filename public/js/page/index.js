
'use strict';

/**
 * page index
 */
const list = require('./list.js');
const userDetail = require('./user.detail.js');
const upload = require('./upload.js');
const planCreate = require('./plan.create.js');
const planSetting = require('./plan.setting.js');
const planQuit = require('./plan.quit.js');
const bankCreate = require('./bank.create.js');
const productCreate = require('./product.create.js');
const discount = require('./discount.js');
const userForbid = require('./user.forbid.js');
const planTemplateEvent = require('./plan.template.create.js');

module.exports = {
  list,
  upload,
  userDetail,
  bankCreate,
  planCreate,
  planSetting,
  planQuit,
  productCreate,
  discount,
  userForbid,
  not_found: noop,
  planTemplateEvent
};

function noop() {};
