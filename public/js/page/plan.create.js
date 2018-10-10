'use strict';

/**
 * plan create & edit
 */
const util = require('../util/index.js');
const compoundRate = util.compoundRate;
const DATE_TIME_FORMAT = util.DATE_TIME_FORMAT;

const defaultOption = {
  el: {
    form: '#J_plan-create-form',
    name: '#J_plan-name',
    immediately: '#J_plan-immediately-release',
    releaseTime: '#J_plan-release-time',
    startTime: '#J_plan-start-time',
    quitTime: '#J_plan-quit-time',
    saleDays: '#J_plan-sale-days',
    durationMonths: '#J_plan-duration-months',
    rate: '#J_plan-rate',
    compoundRate: '#J_plan-compound-rate',
    baseRate: '#J_plan-base-rate',
    extraRate: '#J_plan-extra-rate',
    perMonthDays: '#J_plan_permonth_days'
  },
  plan: null, // 计划数据
  template: null // 模板数据
};
var option = {};
var $el = {};

function updateQuitTime() {
  var start = $el.startTime.val();
  var days = $el.saleDays.val();
  var months = $el.durationMonths.val();
  var duation = option.template && option.template.beginDisplayTimeInterval;
  var name = option.template && option.template.name;
  var quitTime;
  var releaseTime;
  quitTime = moment(start);
  releaseTime = moment(start);
  days = ~~days;
  months = ~~months;
  if (name && releaseTime.isValid()) {
    $el.name.val(name + ' ' + releaseTime.format('YYMMDD') + '期');
  }
  if (duation && releaseTime.isValid()) {
    $el.releaseTime.val(
      releaseTime.subtract(duation, 'hours').format(DATE_TIME_FORMAT)
    );
  }
  if ($el.startTime.val() && $el.saleDays.val()) {
    $el.perMonthDays.val(
      moment(start)
        .add(days, 'days')
        .format('DD')
    );
  }
  // 全部正确的时候才应该更新
  if (quitTime.isValid() && days && months) {
    $el.quitTime.val(
      quitTime
        .add(days, 'days')
        .add(months, $('#J_plan_dateType').val() == 'DAY' ? 'days' : 'months')
        .format(DATE_TIME_FORMAT)
    );
  }
}

function updateInterestRate() {
  var months = $el.durationMonths.val();
  var factor = 10000;
  var interest;
  var total;
  var base;
  var month;
  // 转成整形计算，float精度问题
  interest = parseInt(factor * $el.rate.val(), 10) / factor;
  months = ~~months;

  if (interest && months) {
    if ($('#J_plan_cashtype').val() == 'INVEST') {
      month =
        compoundRate(
          interest,
          $('#J_plan_dateType').val() == 'DAY' ? 1 : months
        ) + '0';
      $el.compoundRate.val(month);
    } else {
      $el.compoundRate.val($el.rate.val());
    }
  }
  total = Math.round(factor * $el.compoundRate.val());
  base = Math.round(factor * $el.baseRate.val());

  if (total && base && total >= base) {
    $el.extraRate.val(parseInt(total - base, 10) / factor);
  }
}
function bindEvent() {
  // depends semantic-ui
  $el.immediately.on('change', function() {
    var isChecked = this.checked;
    $el.releaseTime.prop('disabled', isChecked);
  });
  // 开始时间，销售天数，锁定期 改变的时候，改变退出时间
  $el.startTime.on('change', updateQuitTime);
  $el.saleDays.on('change', updateQuitTime);
  $el.durationMonths.on('change', updateQuitTime);
  // 利率
  $el.compoundRate.on('change', updateInterestRate);
  $el.baseRate.on('change', updateInterestRate);
  // 单利计算复利
  $el.durationMonths.on('change', updateInterestRate);
  $el.rate.on('change', updateInterestRate);
}

function cashTypeHandler() {
  $('#J_plan_cashtype').change(function() {
    updateInterestRate();
    if ($(this).val() == 'HXB') {
      $('.J_accrual').html('（单利）');
      $('#J_plan-compound-rate').attr('placeHolder', '预期收益率（单利）');
      $('#J_plan-base-rate').attr('placeHolder', '基准利率（单利）');
    } else {
      $('.J_accrual').html('（复利）');
      $('#J_plan-compound-rate').attr('placeHolder', '预期收益率（复利）');
      $('#J_plan-base-rate').attr('placeHolder', '基准利率（复利）');
      $el.perMonthDays.val('');
    }
  });
}

function init() {
  bindEvent();
  updateQuitTime();
  cashTypeHandler();
}

module.exports = function(opt) {
  $.extend(option, defaultOption, opt);
  $.each(option.el, function(index, value) {
    $el[index] = $(value);
  });
  init();
};
