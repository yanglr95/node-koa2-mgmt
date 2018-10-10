
'use strict';

/**
 * app.js
 **/

// datetimepicker require
const moment = window['moment'] = require('moment');
require('moment/locale/zh-cn');
require('jquery-mousewheel');
// datetimepicker
require('../thirdparty/datetimepicker/jquery.datetimepicker.js')(jQuery);

const dropzone = window['Dropzone'] = require('../thirdparty/dropzone/dropzone.js');
const toastr = window['toastr'] = require('../thirdparty/toastr/toastr.js')(jQuery);
const NProgress = window['NProgress'] = require('../thirdparty/nprogress/nprogress.js');

const handler = require('./page/index.js');
const util = require('./util/index.js');

const formError = require('./util/form.error.js');
const modal = require('./util/modal.js');
const tplDimmer = require('./util/dimmer.pug');

const DATE_TIME_FORMAT = util.DATE_TIME_FORMAT;
const DATE_FORMAT = util.DATE_FORMAT;
const TIME_FORMAT = util.TIME_FORMAT;

dropzone.autoDiscover = false;

const app = {
  formError,
  notify: toastr,
  util,
  handler: route => handler[route] || handler.not_found,
  CSRFProtection(xhr) {
    var token = $('meta[name="csrf-token"]').attr('content');
    if (token) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  },
  refreshCSRFTokens() {
    var csrfToken = $('meta[name=csrf-token]').attr('content');
    var csrfParam = $('meta[name=csrf-param]').attr('content');
    $('form input[name="' + csrfParam + '"]').val(csrfToken);
  },
  attachCSRF() {
    $.ajaxPrefilter((options, originalOptions, xhr) => {
      if (!options.crossDomain) {
        app.CSRFProtection(xhr);
      }
    });
    this.refreshCSRFTokens();
  },
  init() {
    this.attachCSRF();
    this.initForm();
    return this;
  },
  initForm() {
    $('form').on('submit', function(event) {
      var $from = $(this).addClass('loading');
      setTimeout(() => {
        $from.removeClass('loading');
      }, 1e4);
    });
  }
};

// init component
moment.locale('zh-cn');

$.datetimepicker && $.datetimepicker.setDateFormatter({
  parseDate: function(date, format) {
    var d = moment(date, format);
    return d.isValid() ? d.toDate() : false;
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  }
});
$.datetimepicker && $.datetimepicker.setLocale('zh');
$.extend($.fn.datetimepicker.defaults, {
  format: DATE_TIME_FORMAT,
  formatTime: TIME_FORMAT,
  formatDate: DATE_FORMAT
});

// NProgress
NProgress.start();
$(window).on('load', function() {
  NProgress.done();
});

if (!window['app']) {
  window['app'] = app;
  app.init();
}

// dom ready
$(function() {
  var $document = $(document);
  var $accordion = $('.ui.accordion');
  var $datetimepicker = $('.datetimepicker');
  var $toggleButton = $('.J_toggle-checkbox-button');
  var $toggleCheckbox = $('.J_item-checkbox');
  $document.ajaxStart(function() {
    NProgress.start();
  }).ajaxStop(function() {
    NProgress.done();
  });
  // dropdown
  $('.ui.dropdown').dropdown({
    on: 'hover'
  });
  $('.ui.checkbox').checkbox();
  $accordion.accordion();
  // datetime picker
  $datetimepicker.each(function() {
    var $this = $(this);
    var format = $this.data('format') || DATE_FORMAT;
    $this.prop('autocomplete', 'off');
    if ($this.is('.datetimepicker-date')) {
      format = DATE_FORMAT;
      $this.datetimepicker({
        timepicker: false,
        format: format
      });
    } else if ($this.is('.datetimepicker-time')) {
      format = TIME_FORMAT;
      $this.datetimepicker({
        datepicker: false,
        format: format
      });
    } else if ($this.is('.datetimepicker-datetime')) {
      format = DATE_TIME_FORMAT;
      $this.datetimepicker({
        format: format
      });
    } else {
      $this.datetimepicker({ format: format });
    }
  });
  // 全选、反选
  if ($toggleButton.length) {
    $toggleButton.checkbox({
      onChecked: function() {
        $toggleCheckbox.checkbox('check');
      },
      onUnchecked: function() {
        $toggleCheckbox.checkbox('uncheck');
      }
    });
  }
  $document.on('click', '.J_update', function(e) {
    const $me = $(this);
    const _url = $me.data('url');
    const _data = $me.data('post');
    const _title = $me.data('title') || $me.attr('title') || '更新';
    if ($me.is('.loading')) {
      return false;
    }
    $.post(_url, _data, function(ret) {
      $me.removeClass('loading');
      if (ret.status == 0) {
        toastr.success(`${_title}成功`);
      } else {
        toastr.error(`${_title}操作失败:` + ret.message || '未知原因');
      }
    }, 'json').fail(function() {
      toastr.error(`${_title}操作失败，稍后重试`);
      $me.removeClass('loading');
    });
    $me.addClass('loading');
  });
  $document.on('click', '.J_delete', function(e) {
    const $me = $(this);
    const $tr = $me.closest('tr');
    const _url = $me.data('url');
    const _data = $me.data('post');
    const _title = $me.data('title') || $me.attr('title') || '删除';
    const $deleteModal = modal({ title: `确认${_title}`, content: `${_title}后不可恢复` });
    $deleteModal
      .modal({
        onApprove: () => {
          $.post(_url, _data, function(ret) {
            if (ret.status == 0) {
              toastr.success('删除成功');
              $tr.remove();
            } else {
              toastr.error(ret.message || '操作失败，稍后重试');
            }
          }, 'json').fail(function() {
            toastr.error('操作失败，稍后重试');
          });
        },
        onHidden: () => {
          $deleteModal.remove();
        }
      })
      .modal('show');
    return false;
  });
  $document.on('click', '.J_dimmer-btn', function(e) {
    const $me = $(this);
    const $dimmer = $('#J_dimmer').length ? $('#J_dimmer') : $(tplDimmer()).appendTo(document.body);
    const _content = $me.data('content');
    $dimmer.find('.center').html(_content);
    $dimmer.dimmer().dimmer('show');
  });
  // 列表页批量操作
  app.handler('list')();
});

// export
export default app;
