'use strict';

/**
 * active
 */

const ACTIVE_TEXT = '生效中';
const UNSTART_ACTIVE_TEXT = '未生效';
const DEACTIVE_ACTIVE_TEXT = '已失效';

/**
 * attach isActive & activeText
 *
 * @param {Object} object
 * @returns {Object} object
 */
module.exports = (model = {}) => {
  const now = Date.now();
  const start = (model.start - 0) || 0;
  const end = (model.end - 0) || 0;

  model.isActive = false;
  // 在有效期
  if (start < now && (!end || now < end)) {
    model.isActive = true;
    model.activeText = ACTIVE_TEXT;
  } else if (start > now) {
    model.activeText = UNSTART_ACTIVE_TEXT;
  } else {
    model.activeText = DEACTIVE_ACTIVE_TEXT;
  }

  return model;
};
