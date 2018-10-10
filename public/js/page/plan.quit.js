
'use strict';

/**
 * user plan quit
 */

const defaultOption = {
  el: {
    rate: '#J_rate',
    amount: '#J_amount'
  },
  amount: 0
};
var option = {};
var $el = {};

function updateAmount() {
  var amount = option.amount;
  var rate = $el.rate.val();
  if (amount && rate) {
    $el.amount.val(
      amount * rate / 100
    );
  }
}

function bindEvent() {
  $el.rate.on('change', updateAmount);
}

function init() {
  bindEvent();
  updateAmount();
}

module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  $.each(option.el, function(index, value) {
    $el[index] = $(value);
  });
  init();
};
