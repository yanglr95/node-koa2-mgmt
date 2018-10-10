
'use strict';

/**
 * discount issue
 */
const uploader = require('../util/upload.js');

const defaultOption = {
  uploadHolder: '#J_user-charge-uploader',
  acceptedFiles: '.xls, .xlsx, .txt',
  field: 'file',
  act: 'discount'
};
const option = {};

function bindEvent() {
  uploader({
    uploadHolder: option.uploadHolder,
    acceptedFiles: option.acceptedFiles,
    field: option.field,
    act: option.act
  });
}
function init() {
  bindEvent();
};

module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  init();
};
