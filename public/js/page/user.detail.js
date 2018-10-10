
'use strict';

/**
 * user detail
 */
const defaultOption = {
  el: {
    'mobile': '#J_user-mobile',
    'trigger': '#J_user-mobile-trigger'
  }
};
const option = {};
const $el = {};

function bindEvent() {
  $el.mobile.data('mask', $el.mobile.text());
  $el.trigger.data('mask', $el.trigger.text());
  $el.trigger.on('click', function() {
    var text = $el.mobile.text();
    if (text && text.length) {
      if (text == $el.mobile.data('mask')) {
        $el.mobile.text($el.mobile.data('raw'));
        $el.trigger.text($el.trigger.data('raw'));
      } else {
        $el.mobile.text($el.mobile.data('mask'));
        $el.trigger.text($el.trigger.data('mask'));
      }
    }
    return false;
  });
}

function init() {
  bindEvent();
};

module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  $.each(option.el, function(index, value) {
    $el[index] = $(value);
  });
  init();
};
