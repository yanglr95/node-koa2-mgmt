
'use strict';

/**
 * upload
 */

const defaultOption = {
  maxFiles: 1, // 1 file
  maxFilesize: 5, // 5m
  paramName: 'file',
  acceptedFiles: 'image/*',
  act: 'banner',
  field: 'image',
  dictDefaultMessage: '将文件直接拖拽到这里或者点击选择文件上传',
  dictFallbackMessage: '你的浏览器不支持上传，建议使用chrome',
  dictFallbackText: 'Please use the fallback form below to upload your files like in the olden days.',
  dictFileTooBig: '文件过大，最大只支持 {{maxFilesize}}MiB.',
  dictInvalidFileType: '不允许上传此类型文件',
  dictResponseError: '服务器响应错误: {{statusCode}}',
  dictCancelUpload: '取消',
  dictCancelUploadConfirmation: '您确认要取消上传？',
  dictRemoveFile: '移除',
  dictMaxFilesExceeded: '您不能上传更多文件'
};
const $el = {};

var option;
var imageUploader;

module.exports = function(opt) {
  option = $.extend({}, defaultOption, opt);
  $.each(['uploadHolder'], function(k, v) {
    $el[v] = $(option[v]);
  });
  return initUploader();
};

function initUploader() {
  var token = $('meta[name="csrf-token"]').attr('content');
  var headers = {};
  // csrf token
  if (token) {
    headers['X-CSRF-Token'] = token;
  }
  if (!$el.uploadHolder || !$el.uploadHolder.length) {
    return;
  }
  imageUploader = new Dropzone($el.uploadHolder.get(0), {
    url: '/uploadfile/' + option.act,
    maxFiles: option.maxFiles,
    maxFilesize: option.maxFilesize,
    paramName: option.paramName,
    headers: headers,
    acceptedFiles: option.acceptedFiles,
    fallback: option.fallback || uploadFallback,
    clickable: option.clickable == void (0) ? true : option.clickable,
    init: option.init || uploadInit,
    // previewsContainer: option.previewsContainer || false,
    addRemoveLinks: true,
    previewsContainer: option.previewsContainer || null,
    createImageThumbnails: option.createImageThumbnails || true,
    dictDefaultMessage: option.dictDefaultMessage,
    dictFallbackMessage: option.dictFallbackMessage,
    dictFallbackText: option.dictFallbackText,
    dictFileTooBig: option.dictFileTooBig,
    dictInvalidFileType: option.dictInvalidFileType,
    dictResponseError: option.dictResponseError,
    dictCancelUpload: option.dictCancelUpload,
    dictCancelUploadConfirmation: option.dictCancelUploadConfirmation,
    dictRemoveFile: option.dictRemoveFile,
    dictRemoveFileConfirmation: option.dictRemoveFileConfirmationnull,
    dictMaxFilesExceeded: option.dictMaxFilesExceeded
  });
  return imageUploader;
}

function uploadFallback() {
  var ele = $(this.element);
  ele.addClass('dz-browser-not-supported').find('.dz-message').text('您的浏览器不支持上传，建议使用chrome浏览器');
}

function uploadInit() {
  var ctx = this;
  var files = $el.uploadList || [];
  var existingFileCount = files.length || 0;
  var $form = $el.uploadHolder.closest('form');
  var _form = $form.get(0);
  var $field = $(_form[option.field]);
  $.each(files, function(idx, obj) {
    var mockFile = obj;
    ctx.emit('addedfile', mockFile);
    ctx.emit('complete', mockFile);
  });
  ctx.options.maxFiles = ctx.options.maxFiles - existingFileCount;
  this.on('success', function(file, response, e) {
    var _path = response && response.data && response.data.path;
    var _name = response && response.data && response.data.name;
    if (response.status == 0 && $field && $field.length) {
      $field.val(_path);
      app.notify.success(_name + '上传成功');
    } else {
      app.notify.error(response.message || '上传失败，请稍后重试');
      this.removeFile(file);
    }
  });
  this.on('error', function(file, message) {
    this.removeFile(file);
    app.notify.error(message);
  });
  this.on('removedfile', function(file, message) {
    // 删除文件置空
    if (!this.files.length) {
      $field.val('');
    }
  });
}
