
'use strict';

/**
 * formula
 */

exports.compoundRate = compoundRate;

// 单利年化利率 计算 复利年化利率
function compoundRate(interest, period) {
  let factor = 10;
  if (period == 1) {
    return interest.toFixed(1);
  }
  return (Math.floor((
    (Math.pow((1 + interest / 1200), period) - 1) * 1200 / period
  ) * factor) / factor).toFixed(1);
}
