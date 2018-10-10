
'use strict';

/**
 * plan
 */
const defaultOption = {
  el: {
    form: '#J_plan-create-form'
  },
  optionList: [
    {k: 'NEWBIE', v: '新手'},
    {k: 'L', v: '长期'},
    {k: 'M', v: '中期'},
    {k: 'S', v: '短期'}
  ],
  plan: null, // 计划数据
  template: null // 模板数据
};
var option = {};
var $el = {};

function render($ele, index) {
  var selected = {};
  index = index || 0;
  $ele.each(function(idx) {
    var $me = $(this);
    var val = $me.val();
    if (idx < index) {
      selected[$me.val()] = true;
      return;
    }
    $me.empty();
    option.optionList.map(function(item) {
      if (!selected[item.k]) {
        var $option = $('<option>').text(item.v).val(item.k);
        if (val && val == item.k) {
          $option.prop('selected', true);
        }
        $me.append($option);
      }
    });
    selected[$me.val()] = true;
  });
}

function init() {
  $('.J_order-total').each(function() {
    var $me = $(this);
    $me.on('change', function(event) {
      if (!$me.val()) {
        $me._$select.prop('disabled', true);
      } else {
        $me._$select.prop('disabled', false);
      }
    });
    $me._$select = $me.closest('.J_order').find('select').not($me);
    if (!$me.val()) {
      $me._$select.prop('disabled', true);
    } else {
      $me._$select.prop('disabled', false);
    }
    $me._$select.on('change', function(event) {
      var idx = $(this).data('_selectIdx');
      render($me._$select, idx + 1);
    }).each(function(idx) {
      $(this).data('_selectIdx', idx);
    });
    render($me._$select);
  });
}

module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  $.each(option.el, function(index, value) {
    $el[index] = $(value);
  });
  init();
};
