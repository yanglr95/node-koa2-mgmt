
'use strict';

/**
 * bank create & edit
 */
const defaultOption = {
  el: {
    'filedset': '#J_bank-create-fieldset',
    'holder': '#J_bank-create-fieldset-holder'
  }
};

var option = {};
var $el = {};
var selector = '.inline.fields';

function addItem() {
  $el.holder.find(selector).last().clone().appendTo($el.holder).find(':text').val('');
}

function deleteItem(ele) {
  $(ele).remove();
}

function bindEvent() {
  $el.filedset.on('click', '.delete', function(e) {
    if ($el.holder.find(selector).length > 1) {
      deleteItem($(this).closest(selector));
    }
    return false;
  }).on('click', 'button.add', function() {
    addItem();
  });
}

function init() {
  bindEvent();
}
module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  $.each(option.el, function(index, value) {
    $el[index] = $(value);
  });
  init();
};
