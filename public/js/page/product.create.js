
'use strict';

/**
 * product create & edit
 */
const defaultOption = {
  el: {
    'filedset': '.J_fieldset'
  }
};

var option = {};
var $el = {};
var itemSelector = '.J_fieldset-item';
var holderSelector = '.J_fieldset-holder';
var pannelSelector = '.J_fieldset';
var isSubmiting = false;

function addItem(ele, holder) {
  $(ele).clone().appendTo($(holder)).find(':text').val('');
}

function deleteItem(ele, holder) {
  $(ele).remove();
}

function bindEvent() {
  $el.filedset.on('click', '.delete', function(e) {
    var $holder = $(this).closest(holderSelector);
    var $item = $(this).closest(itemSelector);
    if ($holder.find(itemSelector).length > 1) {
      deleteItem($item, $holder);
    }
    return false;
  }).on('click', 'button.add', function() {
    var $pannel = $(this).closest(pannelSelector);
    var $holder = $pannel.find(holderSelector);
    var $item = $pannel.find(itemSelector).last();
    addItem($item, $holder);
  });
}

function distinct() {
  var _arr = [];
  var _json = {};
  var _form = '#J_product-create-form';
  $(_form).on('submit', function() {
    var $month = $('.J_month');
    for (var i = 0; i < $month.length; i++) {
      _arr.push($($month[i]).val());
    }
    for (var j = 0; j < _arr.length; j++) {
      if (!_json[_arr[j]]) {
        _json[_arr[j]] = 1;
      } else {
        $(this).removeClass('loading');
        alert('借款期限不能相同');
        _json = {};
        _arr = [];
        return false;
      }
    }
    if (isSubmiting) {
      return false;
    }
    isSubmiting = true;
  });
}

function init() {
  bindEvent();
  distinct();
}
module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  $.each(option.el, function(index, value) {
    $el[index] = $(value);
  });
  init();
};
