
'use strict';

/**
 *
 */

function planTemplateEvent() {
  var subsidyInterestRate = $('#J_subsidyInterestRate');
  var lockPeriod = $('#J_lockPeriod');
  var lockPeriodMonth = $('#J_lockPeriodMonth');
  var subsidyInterestRateinput = $('#J_subsidyInterestRate input');
  var lockPeriodinput = $('#J_lockPeriod input');
  var lockPeriodselect = $('#J_lockPeriod select');
  var lockPeriodMonthinput = $('#J_lockPeriodMonth input');
  $('#J_financePlanType').on('change', function() {
    if ($(this).val() == 'NOVICE') {
      subsidyInterestRate.show();
      lockPeriodMonth.hide();
      lockPeriod.show();
      subsidyInterestRateinput.prop('disabled', false);
      lockPeriodinput.prop('disabled', false);
      lockPeriodselect.prop('disabled', false) && $('.datetype').removeClass('disabled');
      lockPeriodMonthinput.prop('disabled', true);
    } else {
      subsidyInterestRate.hide();
      lockPeriodMonth.show();
      lockPeriod.hide();
      subsidyInterestRateinput.prop('disabled', true);
      lockPeriodinput.prop('disabled', true);
      lockPeriodselect.prop('disabled', true);
      lockPeriodMonthinput.prop('disabled', false);
    }
  });
  $('.monthday').on('change', function() {
    lockPeriod.show();
  });
}

function init() {
  planTemplateEvent();
}

module.exports = function() {
  init();
};
