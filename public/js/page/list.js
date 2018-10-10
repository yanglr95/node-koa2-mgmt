
'use strict';

/**
 * list
 */
const modal = require('../util/modal.js');

function bindEvent() {
  const $document = $(document);
  // 批量操作
  $document.on('click', '.J_batch-button', function(event) {
    var $me = $(this);
    var $form = $me.closest('form');
    var _form = $form.get(0);
    var $batch = $(_form['batch']);
    var $ids = $(_form['ids']);
    var $action = $(_form['action']);
    var _action = $batch.val();
    var _actionName = $batch.closest('.dropdown').dropdown('get text');
    var _ids = [];
    var _modal;
    $ids && $ids.length && $.each($ids, function(idx, input) {
      if (input.checked) {
        _ids.push($(input).data('extra'));
      }
    });
    // 需要批量action 和操作对象 ids
    if (!_action || !_action.length || !_ids.length) {
      app.notify.warning('请选择要操作的对象和要进行的操作');
      return;
    }
    _modal = modal({
      title: `批量操作: ${_actionName}`,
      content: `选择 ${_ids.length} 个`
    })
      .modal({
        onApprove: function() {
          // 提交批量操作form
          $action.val('batch');
          $form.submit();
          $action.val('query');
        },
        onHidden: function() {
          _modal.remove();
        }
      })
      .modal('show');
  });
  // 翻页
  $document.on('click', '.J_pagination .item', function(event) {
    var $me = $(this);
    var $form = $me.closest('form');
    var _form = $form.get(0);
    var $action = $(_form['action']);
    var $page = $(_form['page']);
    var page = $me.data('page');
    if (!$me.is('active') && !$me.is('disabled') && page) {
      $action.val('query');
      $page.val(page);
      $form.submit();
    }
  });
  // 每页
  $document.on('change', '.J_pagination .dropdown', function(event) {
    var $me = $(this);
    var $form = $me.closest('form');
    var _form = $form.get(0);
    var $page = $(_form['page']);
    // 每页改变，直接去第一页
    $page.val(1);
    $form.submit();
  });
}

module.exports = function(opt) {
  bindEvent();
};
