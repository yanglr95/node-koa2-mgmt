
'use strict';

/**
 * banner create
 */
const uploader = require('../util/upload.js');

const defaultOption = {
  uploadHolder: '#J_user-charge-uploader',
  field: 'filePath',
  act: 'cert'
};
const option = {};

function bindEvent() {
  uploader({
    uploadHolder: option.uploadHolder,
    field: option.field,
    act: option.act,
    maxFilesize: option.maxFilesize
  });
}
function init() {
  bindEvent();
};

module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  init();
};
